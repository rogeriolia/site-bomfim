#!/usr/bin/env bash
# Instala ou atualiza o site em /opt/site-bomfim sem GitHub Actions.
# Use LF line endings only (pipe from Windows with Get-Content -Raw can inject CRLF).
set -euo pipefail

TARGET="/opt/site-bomfim"
REPO="https://github.com/rogeriolia/site-bomfim.git"
WORK="$(mktemp -d)"

cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

command -v git >/dev/null || { echo "apt install -y git" >&2; exit 1; }
command -v npm >/dev/null || { echo "Instale Node 20+ e npm" >&2; exit 1; }
command -v zip >/dev/null || { echo "apt install -y zip" >&2; exit 1; }

sudo mkdir -p "$TARGET"
ENV_BACKUP=""
if [[ -f "$TARGET/.env" ]]; then
  ENV_BACKUP="$(mktemp)"
  cp "$TARGET/.env" "$ENV_BACKUP"
fi

git clone --depth 1 "$REPO" "$WORK"
cd "$WORK"
npm ci
npm run build

for item in dist backend run.py requirements.txt .htaccess deploy scripts api; do
  [[ -e "$item" ]] && sudo cp -a "$item" "$TARGET/"
done

if [[ -n "$ENV_BACKUP" ]]; then
  sudo cp "$ENV_BACKUP" "$TARGET/.env"
fi

sudo chmod +x "$TARGET/scripts/server/"*.sh
cd "$TARGET"
sudo bash scripts/server/post-deploy.sh || true

echo "Pronto em $TARGET:"
ls -la "$TARGET"