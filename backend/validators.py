from __future__ import annotations

import re
from html import escape
from typing import Any
from urllib.parse import urlparse

UUID_V4_RE = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
    re.IGNORECASE,
)

LANDING_PATHS = frozenset(
    {
        "/lp/cotacao",
        "/lp/cotacao-completa",
        "/lp/embarques-frequentes",
        "/lp/falar-comercial",
    }
)

UTM_KEYS = frozenset(
    {
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "gclid",
        "li_fat_id",
    }
)

TELEMETRY_TYPES = frozenset(
    {
        "page_view",
        "heartbeat",
        "click",
        "pointer_move",
        "scroll",
        "form_start",
        "form_step",
        "form_submit",
        "conversion",
    }
)


def clean_value(value: Any, limit: int = 500) -> str:
    if not isinstance(value, (str, int, float, bool)):
        return ""
    return str(value).strip()[:limit]


def esc(value: str) -> str:
    return escape(value, quote=True)


def valid_uuid_v4(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    if not UUID_V4_RE.match(value):
        return None
    return value.lower()


def normalize_landing_path(path: Any) -> str | None:
    raw = clean_value(path, 2000)
    parsed = urlparse(raw).path or raw
    parsed = re.sub(r"^/site-bomfim(?=/|$)", "", parsed)
    return parsed if parsed in LANDING_PATHS else None


def filter_utm(raw: Any) -> dict[str, str]:
    if not isinstance(raw, dict):
        return {}
    out: dict[str, str] = {}
    for key in UTM_KEYS:
        if key in raw and isinstance(raw[key], (str, int, float, bool)):
            text = clean_value(raw[key], 300)
            if text:
                out[key] = text
    return out


def digits_only(value: str) -> str:
    return re.sub(r"\D", "", value)