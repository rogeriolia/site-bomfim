#!/usr/bin/env python3
"""Cria o banco site no Postgres (via túnel SSH) e aplica schema + seed."""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
import time
from pathlib import Path
from urllib.parse import quote_plus

from dotenv import load_dotenv
import psycopg

ROOT = Path(__file__).resolve().parents[2]


def _conninfo(host: str, port: int, user: str, password: str, db: str, sslmode: str) -> str:
    return (
        f"postgresql://{quote_plus(user)}:{quote_plus(password)}"
        f"@{host}:{port}/{db}?sslmode={quote_plus(sslmode)}"
    )


def _run_sql_file(url: str, path: Path) -> None:
    with psycopg.connect(url, autocommit=True) as conn:
        conn.execute(path.read_text(encoding="utf-8"))


def main() -> int:
    load_dotenv(ROOT / ".env")
    load_dotenv(ROOT / ".env.bomfim")

    parser = argparse.ArgumentParser(description="Provisionar banco site (schema-site + seed).")
    parser.add_argument("--host", default=os.getenv("DB_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.getenv("DB_PORT", "5432")))
    parser.add_argument("--tunnel-port", type=int, default=int(os.getenv("BOMFIM_DB_TUNNEL_PORT", "15432")))
    parser.add_argument("--no-tunnel", action="store_true", help="Conectar direto em --host (sem SSH).")
    parser.add_argument(
        "--reseed",
        action="store_true",
        help="TRUNCATE unidade/gerente e reaplica api/seed-unidades-gerentes.sql",
    )
    args = parser.parse_args()

    user = os.getenv("DB_USER", "postgres")
    password = os.getenv("DB_PASSWORD", "")
    target_db = os.getenv("DB_NAME", "site")
    sslmode = os.getenv("DB_SSLMODE", "prefer")
    ssh_target = os.getenv("BOMFIM_SSH_TUNNEL", "")
    key = Path(os.getenv("BOMFIM_SSH_KEY", Path.home() / ".ssh" / "site_bomfim_deploy"))

    if not password:
        print("erro: defina DB_PASSWORD no .env", file=sys.stderr)
        return 1

    tunnel: subprocess.Popen | None = None
    host = args.host
    port = args.port

    if not args.no_tunnel:
        if not ssh_target:
            print("erro: defina BOMFIM_SSH_TUNNEL ou use --no-tunnel", file=sys.stderr)
            return 1
        if not key.is_file():
            print(f"erro: chave SSH não encontrada: {key}", file=sys.stderr)
            return 1
        tunnel = subprocess.Popen(
            [
                "ssh",
                "-i",
                str(key),
                "-o",
                "BatchMode=yes",
                "-o",
                "ExitOnForwardFailure=yes",
                "-o",
                "ConnectTimeout=15",
                "-L",
                f"{args.tunnel_port}:127.0.0.1:5432",
                ssh_target,
                "-N",
            ],
        )
        time.sleep(1.2)
        if tunnel.poll() is not None:
            print("erro: túnel SSH não iniciou", file=sys.stderr)
            return 1
        host = "127.0.0.1"
        port = args.tunnel_port
        print(f"ok: túnel SSH → {host}:{port}")

    admin_url = _conninfo(host, port, user, password, "postgres", sslmode)
    site_url = _conninfo(host, port, user, password, target_db, sslmode)

    try:
        with psycopg.connect(admin_url, connect_timeout=12) as conn:
            conn.autocommit = True
            with conn.cursor() as cur:
                cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (target_db,))
                if not cur.fetchone():
                    cur.execute(f"CREATE DATABASE {target_db} ENCODING 'UTF8' TEMPLATE template0")
                    print(f"ok: banco {target_db!r} criado")
                else:
                    print(f"ok: banco {target_db!r} já existia")

        migration = ROOT / "api" / "migrations" / "001_unidade_gerente_many_to_one.sql"
        schema = ROOT / "api" / "schema-site.sql"
        seed = ROOT / "api" / "seed-unidades-gerentes.sql"
        if migration.is_file():
            _run_sql_file(site_url, migration)
            print("ok: migration 001 aplicada")
        _run_sql_file(site_url, schema)
        print("ok: schema-site.sql aplicado")
        if args.reseed:
            with psycopg.connect(site_url, autocommit=True) as conn:
                conn.execute("TRUNCATE unidade, gerente RESTART IDENTITY CASCADE")
            print("ok: unidades e gerentes truncados (--reseed)")
        _run_sql_file(site_url, seed)
        print("ok: seed aplicado (ignorado se unidades já existiam)")

        with psycopg.connect(site_url, connect_timeout=12) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT count(*) FROM unidade")
                units = cur.fetchone()[0]
                cur.execute("SELECT count(*) FROM gerente")
                managers = cur.fetchone()[0]
        print(f"ok: {units} unidade(s), {managers} gerente(s)")

        tunnel_url = _conninfo("127.0.0.1", args.tunnel_port if tunnel else port, user, password, target_db, sslmode)
        if tunnel:
            env_line = f'BOMFIM_SITE_DATABASE_URL={tunnel_url}'
        else:
            env_line = f'BOMFIM_SITE_DATABASE_URL={site_url}'
        print(f"dica: adicione ao .env (dev com túnel): {env_line}")
        return 0
    except Exception as exc:
        print(f"erro: {exc}", file=sys.stderr)
        return 1
    finally:
        if tunnel is not None and tunnel.poll() is None:
            tunnel.terminate()
            try:
                tunnel.wait(timeout=5)
            except subprocess.TimeoutExpired:
                tunnel.kill()


if __name__ == "__main__":
    raise SystemExit(main())