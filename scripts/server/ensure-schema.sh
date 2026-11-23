#!/usr/bin/env bash
# Aplica api/schema.sql se BOMFIM_DATABASE_URL existir e tabelas ainda não existirem.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="$ROOT/.env"
SCHEMA="$ROOT/api/schema.sql"
if [[ ! -f "$ENV_FILE" ]] || [[ ! -f "$SCHEMA" ]]; then
  echo "skip: .env ou schema ausente" >&2
  exit 0
fi
line="$(grep -E '^BOMFIM_DATABASE_URL=' "$ENV_FILE" | head -1 || true)"
if [[ -z "$line" ]]; then
  echo "skip: BOMFIM_DATABASE_URL não definido"
  exit 0
fi
url="${line#BOMFIM_DATABASE_URL=}"
url="${url%\"}"
url="${url#\"}"
tbl="$(psql "$url" -tAc "SELECT to_regclass('public.bomfim_sessions')" 2>/dev/null || true)"
if [[ -n "$tbl" ]]; then
  echo "ok: schema já presente ($tbl)"
  exit 0
fi
psql "$url" -v ON_ERROR_STOP=1 -f "$SCHEMA"
echo "ok: schema aplicado"