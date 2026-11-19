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

bash "$ROOT/scripts/server/restart-services.sh"