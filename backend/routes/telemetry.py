from __future__ import annotations

import json
import logging
import secrets
from typing import Any
from urllib.parse import urlparse

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from backend.config import get_settings
from backend.db import db_connection, json_param
from backend.validators import (
    TELEMETRY_TYPES,
    clean_value,
    filter_utm,
    normalize_landing_path,
    valid_uuid_v4,
)

logger = logging.getLogger(__name__)

router = APIRouter()

NUMERIC_PAYLOAD_KEYS = frozenset(
    {"step", "scrollDepth", "viewportWidth", "viewportHeight", "screenHeight"}
)
PAYLOAD_KEYS = frozenset(
    {"control", "label", "section", "step", "scrollDepth", "viewportWidth", "viewportHeight", "screenHeight"}
)


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


@router.post("/api/telemetry.php")
async def post_telemetry(request: Request) -> JSONResponse:
    origin = request.headers.get("origin", "")
    expected = _expected_origin(request)
    if origin and not secrets.compare_digest(origin, expected):
        return _json(403, {"success": False})

    body = await request.body()
    if len(body) > 12000:
        return _json(413, {"success": False})

    try:
        input_data = json.loads(body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return _json(400, {"success": False})
    if not isinstance(input_data, dict):
        return _json(400, {"success": False})

    path = normalize_landing_path(input_data.get("path"))
    session_id = valid_uuid_v4(input_data.get("sessionId"))
    event_type = clean_value(input_data.get("type"), 30)
    if not path or not session_id or event_type not in TELEMETRY_TYPES:
        return _json(422, {"success": False})

    utm = filter_utm(input_data.get("utm"))
    referrer = clean_value(input_data.get("referrer"), 500)
    ref_host = urlparse(referrer).hostname
    raw_payload = input_data.get("payload") if isinstance(input_data.get("payload"), dict) else {}
    payload: dict[str, Any] = {}
    for key in PAYLOAD_KEYS:
        if key not in raw_payload:
            continue
        val = raw_payload[key]
        if key in NUMERIC_PAYLOAD_KEYS and isinstance(val, (int, float)):
            payload[key] = float(val)
        else:
            payload[key] = clean_value(val, 100)

    x = input_data.get("x")
    y = input_data.get("y")
    x_val = max(0.0, min(1.0, float(x))) if isinstance(x, (int, float)) else None
    y_val = max(0.0, min(1.0, float(y))) if isinstance(y, (int, float)) else None

    scroll_depth = None
    if "scrollDepth" in payload:
        scroll_depth = max(0, min(100, int(payload["scrollDepth"])))

    try:
        with db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO bomfim_sessions(session_id, first_path, last_path, referrer_host, utm)
                    VALUES (%s, %s, %s, %s, %s::jsonb)
                    ON CONFLICT(session_id) DO UPDATE SET
                        last_path = EXCLUDED.last_path,
                        last_seen = NOW(),
                        utm = CASE
                            WHEN bomfim_sessions.utm = '{}'::jsonb THEN EXCLUDED.utm
                            ELSE bomfim_sessions.utm
                        END
                    """,
                    (session_id, path, path, ref_host, json_param(utm)),
                )
                if scroll_depth is not None:
                    cur.execute(
                        """
                        UPDATE bomfim_sessions
                        SET max_scroll = GREATEST(max_scroll, %s)
                        WHERE session_id = %s
                        """,
                        (scroll_depth, session_id),
                    )
                cur.execute(
                    """
                    INSERT INTO bomfim_events(session_id, page_path, event_type, x, y, payload)
                    VALUES (%s, %s, %s, %s, %s, %s::jsonb)
                    """,
                    (session_id, path, event_type, x_val, y_val, json_param(payload)),
                )
            conn.commit()
        return _json(200, {"success": True})
    except Exception as exc:
        logger.exception("Bomfim telemetry store failed: %s", type(exc).__name__)
        return _json(503, {"success": False})