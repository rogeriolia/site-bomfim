#!/usr/bin/env bash
# Roda no servidor após sync do GitHub Actions (dependências Python + reinício da API).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# Evita deploy acidental no app legado (/opt/bomfim).
case "$ROOT" in
  */site-bomfim|*/site-bomfim/) ;;
  *)
    echo "Deploy recusado: pasta esperada .../site-bomfim (atual: $ROOT). Não altere /opt/bomfim." >&2
    exit 1
    ;;
esac

PYTHON="${PYTHON:-python3}"
VENV="$ROOT/.venv"

if [[ ! -d "$VENV" ]]; then
  "$PYTHON" -m venv "$VENV"
fi

# shellcheck disable=SC1091
source "$VENV/bin/activate"
pip install -q -r requirements.txt

UNIT="bomfim-site-api"
EXAMPLE="$ROOT/deploy/systemd/${UNIT}.service.example"
if [[ -f "$EXAMPLE" ]] && command -v systemctl >/dev/null 2>&1; then
  if ! systemctl cat "${UNIT}.service" &>/dev/null; then
    if [[ "$(id -u)" -eq 0 ]]; then
      cp "$EXAMPLE" "/etc/systemd/system/${UNIT}.service"
      systemctl daemon-reload
      systemctl enable "${UNIT}.service"
    elif command -v sudo >/dev/null 2>&1; then
      sudo cp "$EXAMPLE" "/etc/systemd/system/${UNIT}.service"
      sudo systemctl daemon-reload
      sudo systemctl enable "${UNIT}.service"
    fi
  fi
fi

DEPLOY_USER="${BOMFIM_DEPLOY_USER:-www-data}"
if [[ -f "$ROOT/.env" ]]; then
  line="$(grep -E '^BOMFIM_DEPLOY_USER=' "$ROOT/.env" | head -1 || true)"
  if [[ -n "$line" ]]; then
    val="${line#BOMFIM_DEPLOY_USER=}"
    val="${val%\"}"
    val="${val#\"}"
    DEPLOY_USER="$val"
  fi
fi

run_privileged() {
  if [[ "$(id -u)" -eq 0 ]]; then
    "$@"
  elif command -v sudo >/dev/null 2>&1; then
    sudo "$@"
  else
    return 1
  fi
}

mkdir -p "$ROOT/logs"
for path in dist backend .venv scripts run.py requirements.txt .htaccess deploy api logs; do
  [[ -e "$ROOT/$path" ]] || continue
  run_privileged chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "$ROOT/$path" 2>/dev/null || true
done
if [[ -f "$ROOT/.env" ]]; then
  run_privileged chown root:"${DEPLOY_USER}" "$ROOT/.env" 2>/dev/null || true
  run_privileged chmod 640 "$ROOT/.env" 2>/dev/null || true
fi

bash "$ROOT/scripts/server/ensure-schema.sh" || true
bash "$ROOT/scripts/server/ensure-site-schema.sh" || true

bash "$ROOT/scripts/server/sync-nginx.sh" 2>/dev/null || true

bash "$ROOT/scripts/server/restart-services.sh" || {
  echo "Aviso: serviço ainda não configurado (instale bomfim-site-api no systemd)." >&2
}
