from __future__ import annotations

import logging
import re
import secrets
from typing import Any

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from backend.config import get_settings
from backend.db import db_connection, json_param
from backend.validators import digits_only, normalize_landing_path, valid_uuid_v4

logger = logging.getLogger(__name__)

router = APIRouter()


def _json(status: int, data: dict[str, Any]) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content=data,
        headers={
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
        },
    )


def _expected_origin(request: Request) -> str:
    settings = get_settings()
    if settings.bomfim_site_origin:
        return settings.bomfim_site_origin
    host = request.headers.get("host", "")
    scheme = request.headers.get("x-forwarded-proto", "http")
    return f"{scheme}://{host}"


@router.post("/api/coverage-check.php")
async def post_coverage_check(request: Request) -> JSONResponse:
    origin = request.headers.get("origin", "")
    expected = _expected_origin(request)
    if origin and not secrets.compare_digest(origin, expected):
        return _json(403, {"success": False})

    try:
        input_data = await request.json()
    except Exception:
        return _json(400, {"success": False})
    if not isinstance(input_data, dict):
        return _json(400, {"success": False})

    path = normalize_landing_path(input_data.get("path"))
    session_raw = input_data.get("sessionId")
    session_id = valid_uuid_v4(session_raw)

    cep = digits_only(str(input_data.get("cep") or ""))
    city = str(input_data.get("city") or "").strip()[:100]
    uf = str(input_data.get("uf") or "").strip().upper()[:2]

    if (
        not path
        or (session_raw and not session_id)
        or (len(cep) != 8 and (not city or not re.match(r"^[A-Z]{2}$", uf)))
    ):
        return _json(422, {"success": False})

    query_type = "cep" if len(cep) == 8 else "city"
    query_value = cep if query_type == "cep" else city

    try:
        with db_connection() as conn:
            with conn.cursor() as cur:
                if query_type == "cep":
                    cur.execute(
                        """
                        SELECT city, uf, unit_code, availability
                        FROM bomfim_coverage_base
                        WHERE %s BETWEEN cep_from AND cep_to
                        ORDER BY availability = 'standard' DESC
                        LIMIT 20
                        """,
                        (cep,),
                    )
                else:
                    cur.execute(
                        """
                        SELECT city, uf, unit_code, availability
                        FROM bomfim_coverage_base
                        WHERE uf = %s AND lower(unaccent(city)) = lower(unaccent(%s))
                        ORDER BY availability = 'standard' DESC
                        LIMIT 20
                        """,
                        (uf, city),
                    )
                rows = cur.fetchall()

                if not rows:
                    status = "not_covered"
                elif any(r["availability"] == "standard" for r in rows):
                    status = "covered"
                else:
                    status = "conditional"

                resolved_city = rows[0]["city"] if rows else city
                resolved_uf = rows[0]["uf"] if rows else (uf or None)
                unit_codes = list(dict.fromkeys(r["unit_code"] for r in rows))

                cur.execute(
                    """
                    INSERT INTO bomfim_coverage_checks(
                        session_id, page_path, query_type, query_value, uf, coverage_status, unit_codes
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb)
                    """,
                    (
                        session_id,
                        path,
                        query_type,
                        query_value,
                        resolved_uf,
                        status,
                        json_param(unit_codes),
                    ),
                )
            conn.commit()

        return _json(
            200,
            {
                "success": True,
                "status": status,
                "city": resolved_city,
                "uf": resolved_uf,
                "units": unit_codes,
            },
        )
    except Exception as exc:
        logger.exception("Bomfim coverage check failed: %s", type(exc).__name__)
        return _json(
            503,
            {"success": False, "message": "Não foi possível consultar a cobertura agora."},
        )