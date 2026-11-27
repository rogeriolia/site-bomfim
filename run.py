#!/usr/bin/env python3
"""Bomfim — um comando para desenvolvimento (site + API) ou só API em produção."""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

from dotenv import load_dotenv

from backend.ssh_tunnel import start_site_db_tunnel, stop_site_db_tunnel

ROOT = Path(__file__).resolve().parent
SITE_URL = os.getenv("BOMFIM_DEV_URL", "http://localhost:5173/")
API_PORT = int(os.getenv("BOMFIM_API_PORT", "5183"))


def _banner() -> None:
    api_url = f"http://127.0.0.1:{API_PORT}/"
    bar = "=" * 56
    print(
        f"\n{bar}\n"
        "  Bomfim — modo desenvolvimento\n"
        f"  Site (abra no navegador):  {SITE_URL}\n"
        f"  API (JSON, não é o site):  {api_url}\n"
        "  Ctrl+C encerra site e API juntos.\n"
        f"{bar}\n",
        flush=True,
    )


def _require_npm() -> str:
    npm = shutil.which("npm")
    if not npm:
        print("Node/npm não encontrado. Instale Node.js e rode: npm install", file=sys.stderr)
        sys.exit(1)
    vite_bin = ROOT / "node_modules" / ".bin" / ("vite.cmd" if os.name == "nt" else "vite")
    if not vite_bin.is_file():
        print("Dependências do frontend ausentes. Rode: npm install", file=sys.stderr)
        sys.exit(1)
    return npm


def _run_dev(host: str, port: int, reload: bool, tunnel_proc: subprocess.Popen | None) -> None:
    npm = _require_npm()
    _banner()

    api_cmd = [
        sys.executable,
        str(ROOT / "run.py"),
        "--api-only",
        "--host",
        host,
        "--port",
        str(port),
    ]
    if reload:
        api_cmd.append("--reload")

    env = os.environ.copy()
    creationflags = subprocess.CREATE_NEW_PROCESS_GROUP if os.name == "nt" else 0

    api_proc = subprocess.Popen(
        api_cmd,
        cwd=ROOT,
        env=env,
        creationflags=creationflags,
    )
    vite_proc = subprocess.Popen(
        [npm, "run", "dev:vite"],
        cwd=ROOT,
        env=env,
        shell=os.name == "nt",
        creationflags=creationflags,
    )

    def stop() -> None:
        for proc in (vite_proc, api_proc):
            if proc.poll() is None:
                proc.terminate()
        for proc in (vite_proc, api_proc):
            try:
                proc.wait(timeout=8)
            except subprocess.TimeoutExpired:
                proc.kill()
        stop_site_db_tunnel(tunnel_proc)

    try:
        while True:
            if api_proc.poll() is not None:
                print(f"API encerrou (código {api_proc.returncode}).", file=sys.stderr)
                stop()
                sys.exit(api_proc.returncode or 1)
            if vite_proc.poll() is not None:
                print(f"Vite encerrou (código {vite_proc.returncode}).", file=sys.stderr)
                stop()
                sys.exit(vite_proc.returncode or 1)
            time.sleep(0.4)
    except KeyboardInterrupt:
        print("\nEncerrando site e API…", flush=True)
        stop()


def _run_api_only(host: str, port: int, reload: bool) -> None:
    try:
        import uvicorn
    except ImportError:
        print("Instale: pip install -r requirements.txt", file=sys.stderr)
        sys.exit(1)

    uvicorn.run(
        "backend.app:app",
        host=host,
        port=port,
        reload=reload,
    )


def main() -> None:
    load_dotenv()
    load_dotenv(ROOT / ".env.bomfim")

    parser = argparse.ArgumentParser(
        description="Bomfim: por padrão sobe site (Vite) + API; use --api-only em produção.",
    )
    parser.add_argument(
        "--api-only",
        action="store_true",
        help="Só API FastAPI (deploy/systemd). Sem isto: site + API para desenvolvimento.",
    )
    parser.add_argument("--host", default=os.getenv("BOMFIM_API_HOST", "0.0.0.0"))
    parser.add_argument("--port", type=int, default=API_PORT)
    parser.add_argument("--reload", action="store_true", help="Recarregar API ao editar código (dev)")
    args = parser.parse_args()

    tunnel_proc = start_site_db_tunnel()
    if tunnel_proc is not None:
        os.environ["BOMFIM_SSH_TUNNEL_ACTIVE"] = "1"
    try:
        if args.api_only:
            _run_api_only(args.host, args.port, args.reload)
        else:
            _run_dev(args.host, args.port, args.reload, tunnel_proc)
    finally:
        stop_site_db_tunnel(tunnel_proc)


if __name__ == "__main__":
    main()