from __future__ import annotations

from contextlib import contextmanager
from typing import Generator

from psycopg import Connection
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

from backend.config import get_settings

_site_pool: ConnectionPool | None = None


def get_site_pool() -> ConnectionPool:
    global _site_pool
    if _site_pool is not None:
        return _site_pool
    url = get_settings().bomfim_site_database_url
    if not url:
        raise RuntimeError("BOMFIM_SITE_DATABASE_URL is not configured")
    _site_pool = ConnectionPool(
        conninfo=url,
        min_size=1,
        max_size=5,
        kwargs={"row_factory": dict_row},
    )
    return _site_pool


@contextmanager
def site_db_connection() -> Generator[Connection, None, None]:
    with get_site_pool().connection() as conn:
        yield conn