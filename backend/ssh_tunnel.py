"""Túnel SSH local → Postgres no VPS (desenvolvimento)."""

from __future__ import annotations

import os
import subprocess
import time
from pathlib import Path


def _truthy(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def should_start_site_db_tunnel() -> bool:
    if _truthy("BOMFIM_SSH_TUNNEL_ACTIVE"):
        return False
    if _truthy("BOMFIM_SKIP_SSH_TUNNEL"):
        return False
    if not os.getenv("BOMFIM_SSH_TUNNEL", "").strip():
        return False
    if not os.getenv("BOMFIM_SITE_DATABASE_URL", "").strip() and not os.getenv("DB_PASSWORD", "").strip():
        return False
    return True


def start_site_db_tunnel() -> subprocess.Popen | None:
    if not should_start_site_db_tunnel():
        return None

    ssh_target = os.getenv("BOMFIM_SSH_TUNNEL", "").strip()
    local_port = int(os.getenv("BOMFIM_DB_TUNNEL_PORT", "15432"))
    key = Path(os.getenv("BOMFIM_SSH_KEY", Path.home() / ".ssh" / "site_bomfim_deploy"))

    if not key.is_file():
        print(f"Túnel SSH: chave não encontrada ({key}). Defina BOMFIM_SKIP_SSH_TUNNEL=1 se não precisar.", flush=True)
        return None

    proc = subprocess.Popen(
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
            f"{local_port}:127.0.0.1:5432",
            ssh_target,
            "-N",
        ],
    )
    time.sleep(1.0)
    if proc.poll() is not None:
        print("Túnel SSH: falha ao iniciar (verifique BOMFIM_SSH_TUNNEL e a chave).", flush=True)
        return None
    print(f"Túnel SSH ativo: 127.0.0.1:{local_port} → Postgres no servidor.", flush=True)
    return proc


def stop_site_db_tunnel(proc: subprocess.Popen | None) -> None:
    if proc is None or proc.poll() is not None:
        return
    proc.terminate()
    try:
        proc.wait(timeout=5)
    except subprocess.TimeoutExpired:
        proc.kill()