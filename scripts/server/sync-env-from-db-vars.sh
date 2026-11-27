#!/usr/bin/env bash
# Garante BOMFIM_SITE_DATABASE_URL a partir de DB_USER/DB_PASSWORD/DB_NAME/DB_PORT no .env.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="$ROOT/.env"
[[ -f "$ENV_FILE" ]] || exit 0

python3 - "$ENV_FILE" << 'PY'
import re
import sys
from pathlib import Path
from urllib.parse import quote_plus

p = Path(sys.argv[1])
text = p.read_text(encoding="utf-8")


def get(key: str) -> str:
    m = re.search(rf"^{re.escape(key)}=(.*)$", text, re.M)
    if not m:
        return ""
    v = m.group(1).strip()
    if len(v) >= 2 and v[0] == v[-1] == '"':
        v = v[1:-1]
    return v


def has_active(key: str) -> bool:
    return bool(re.search(rf"^{re.escape(key)}=", text, re.M))


changed = False
if not has_active("BOMFIM_SITE_DATABASE_URL"):
    user = get("DB_USER") or "postgres"
    password = get("DB_PASSWORD")
    dbname = get("DB_NAME") or "site"
    port = get("DB_PORT") or "5432"
    if not password:
        print("skip: DB_PASSWORD ausente", file=sys.stderr)
        sys.exit(0)
    url = f"postgresql://{user}:{quote_plus(password)}@127.0.0.1:{port}/{dbname}"
    text = text.rstrip() + f"\n\nBOMFIM_SITE_DATABASE_URL={url}\n"
    changed = True

if not has_active("BOMFIM_SKIP_SSH_TUNNEL"):
    text = text.rstrip() + "\nBOMFIM_SKIP_SSH_TUNNEL=1\n"
    changed = True

if get("BOMFIM_SITE_ORIGIN").endswith("/site-bomfim"):
    text = re.sub(
        r"^BOMFIM_SITE_ORIGIN=.*$",
        "BOMFIM_SITE_ORIGIN=https://site-bomfim.4lia.com.br",
        text,
        flags=re.M,
    )
    changed = True

if changed:
    p.write_text(text, encoding="utf-8")
    print("ok: .env sincronizado (BOMFIM_SITE_DATABASE_URL)")
else:
    print("ok: .env já tinha BOMFIM_SITE_DATABASE_URL")
PY