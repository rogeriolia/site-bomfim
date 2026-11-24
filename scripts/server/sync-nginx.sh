#!/usr/bin/env bash
# Aplica o vhost de exemplo se LetsEncrypt e nginx existirem (idempotente).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/deploy/nginx/site-bomfim.4lia.com.br.conf.example"
DEST="/etc/nginx/sites-available/site-bomfim.4lia.com.br"
ENABLED="/etc/nginx/sites-enabled/site-bomfim.4lia.com.br"

[[ -f "$SRC" ]] || exit 0
command -v nginx >/dev/null 2>&1 || exit 0
[[ -f /etc/letsencrypt/live/site-bomfim.4lia.com.br/fullchain.pem ]] || exit 0

run_privileged() {
  if [[ "$(id -u)" -eq 0 ]]; then "$@"
  elif command -v sudo >/dev/null 2>&1; then sudo "$@"
  else return 1; fi
}

if ! grep -q '@site_bomfim_spa' "$DEST" 2>/dev/null; then
  run_privileged cp -a "$DEST" "${DEST}.bak.$(date +%Y%m%d%H%M%S)" 2>/dev/null || true
fi
run_privileged cp "$SRC" "$DEST"
run_privileged ln -sf "$DEST" "$ENABLED" 2>/dev/null || true
run_privileged nginx -t
run_privileged systemctl reload nginx
echo "ok: nginx site-bomfim.4lia.com.br"