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

bash "$ROOT/scripts/server/restart-services.sh" || {
  echo "Aviso: serviço ainda não configurado (instale bomfim-site-api no systemd)." >&2
}
