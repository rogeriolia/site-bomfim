from __future__ import annotations

import json
import logging
from contextlib import contextmanager
from typing import Any, Generator

from psycopg import Connection
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

from backend.config import get_settings

logger = logging.getLogger(__name__)

_pool: ConnectionPool | None = None


def get_pool() -> ConnectionPool:
    global _pool
    if _pool is not None:
        return _pool
    url = get_settings().bomfim_database_url
    if not url:
        raise RuntimeError("BOMFIM_DATABASE_URL is not configured")
    _pool = ConnectionPool(
        conninfo=url,
        min_size=1,
        max_size=10,
        kwargs={"row_factory": dict_row},
    )
    return _pool


@contextmanager
def db_connection() -> Generator[Connection, None, None]:
    with get_pool().connection() as conn:
        yield conn


def json_param(data: Any) -> str:
    return json.dumps(data, ensure_ascii=False)