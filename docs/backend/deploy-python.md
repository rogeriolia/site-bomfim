# Deploy da API Python (FastAPI)

Deploy automático pelo GitHub: [deploy-github.md](./deploy-github.md).

O frontend continua chamando `api/leads.php`, `api/telemetry.php` e `api/coverage-check.php`. O serviço Python expõe os mesmos caminhos; os arquivos PHP foram movidos para `api/_retired-php/`.

## Processo

1. Instale dependências na raiz do projeto: `pip install -r requirements.txt`
2. Configure variáveis a partir de [`.env.bomfim.example`](../../.env.bomfim.example) (arquivo `.env` ou ambiente do systemd).
3. Aplique [`api/schema.sql`](../../api/schema.sql) no banco `bomfim_analytics`.
4. Inicie a API: `python run.py --api-only` (porta padrão **5183**). Em desenvolvimento local, `python run.py` sem flags sobe site + API.

### systemd (produção em `/opt/site-bomfim`)

Use [`deploy/systemd/bomfim-site-api.service.example`](../../deploy/systemd/bomfim-site-api.service.example) — serviço **`bomfim-site-api`**. Não alterar o deploy nem o systemd de `/opt/bomfim` (repo **bomfim**).

## Apache (site estático em `dist/`)

Encaminhe `/site-bomfim/api/*` para o Uvicorn **antes** do fallback do React. No vhost (preferível) ou no [`.htaccess`](../../.htaccess) da raiz, com `mod_proxy` habilitado:

```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://127.0.0.1:5183/api/$1 [P,L]
```

A flag `[P]` exige `AllowOverride` com proxy e `ProxyPass`/`ProxyPassReverse` adequados no vhost. Exemplo no vhost:

```apache
ProxyPass /site-bomfim/api/ http://127.0.0.1:5183/api/
ProxyPassReverse /site-bomfim/api/ http://127.0.0.1:5183/api/
```

Ordem: regras de `api/` → arquivos estáticos em `dist/` → fallback SPA.

## Desenvolvimento local

Um terminal: `python run.py` (ou `npm run dev`) — sobe Vite e API e imprime **http://localhost:5173/** para o navegador.

O Vite encaminha `/api` para `http://127.0.0.1:5183` ([`vite.config.js`](../../vite.config.js)).