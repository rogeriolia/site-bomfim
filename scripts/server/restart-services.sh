#!/usr/bin/env bash
# Reinicia a API para carregar .env e código novo. Rode após editar .env manualmente.
set -euo pipefail

SERVICE="${BOMFIM_SYSTEMD_SERVICE:-bomfim-site-api}"

if command -v systemctl >/dev/null 2>&1 && systemctl cat "${SERVICE}.service" &>/dev/null; then
  if [[ "$(id -u)" -eq 0 ]]; then
    systemctl restart "$SERVICE"
  elif command -v sudo >/dev/null 2>&1; then
    sudo systemctl restart "$SERVICE"
  else
    echo "Erro: precisa de root ou sudo para reiniciar $SERVICE" >&2
    exit 1
  fi
  echo "Serviço $SERVICE reiniciado (variáveis em .env recarregadas)."
  exit 0
fi

# Fallback sem systemd: encerra processo na porta 5183 e sobe de novo em background
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
PORT="${BOMFIM_API_PORT:-5183}"
VENV="$ROOT/.venv"

if [[ ! -x "$VENV/bin/python" ]]; then
  echo "Aviso: $VENV/bin/python ausente. Rode scripts/server/post-deploy.sh primeiro." >&2
  exit 1
fi

if command -v fuser >/dev/null 2>&1; then
  fuser -k "${PORT}/tcp" 2>/dev/null || true
elif command -v lsof >/dev/null 2>&1; then
  pid=$(lsof -ti ":$PORT" || true)
  [[ -n "$pid" ]] && kill "$pid" 2>/dev/null || true
fi

mkdir -p "$ROOT/logs"
nohup "$VENV/bin/python" run.py --api-only --host 127.0.0.1 --port "$PORT" >>"$ROOT/logs/api.log" 2>&1 &
echo "API iniciada em 127.0.0.1:$PORT (sem systemd). Log: $ROOT/logs/api.log"