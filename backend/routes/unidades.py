from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from backend.db_site import site_db_connection

logger = logging.getLogger(__name__)

router = APIRouter()

_LIST_UNITS_SQL = """
    SELECT
        u.codigo,
        u.nome,
        u.estado,
        u.uf,
        u.endereco,
        u.telefone,
        u.imagem,
        u.hub,
        g.nome AS gerente_nome,
        g.email AS gerente_email,
        g.telefone AS gerente_telefone,
        g.cargo AS gerente_cargo
    FROM unidade u
    JOIN gerente g ON g.id = u.gerente_id
    WHERE u.ativo AND g.ativo
    ORDER BY u.ordem, u.nome
"""


def _json(status: int, data: dict[str, Any]) -> JSONResponse:
    cache = "public, max-age=60" if status == 200 else "no-store"
    return JSONResponse(
        status_code=status,
        content=data,
        headers={
            "Cache-Control": cache,
            "X-Content-Type-Options": "nosniff",
        },
    )


def _row_to_unit(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "code": row["codigo"],
        "name": row["nome"],
        "state": row["estado"],
        "uf": row["uf"],
        "address": row["endereco"],
        "phone": row["telefone"],
        "image": row["imagem"],
        "hub": row["hub"],
        "manager": {
            "name": row["gerente_nome"],
            "email": row["gerente_email"],
            "phone": row["gerente_telefone"],
            "title": row["gerente_cargo"],
        },
    }


@router.get("/api/unidades.php")
def get_unidades() -> JSONResponse:
    try:
        with site_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(_LIST_UNITS_SQL)
                rows = cur.fetchall()
    except RuntimeError as exc:
        logger.warning("Site DB not configured: %s", exc)
        return _json(
            503,
            {"success": False, "message": "Conteúdo de unidades indisponível no momento."},
        )
    except Exception:
        logger.exception("Failed to list unidades")
        return _json(
            503,
            {"success": False, "message": "Não foi possível carregar as unidades."},
        )

    units = [_row_to_unit(row) for row in rows]
    return _json(200, {"success": True, "units": units})