# Deploy seguro (GitHub → servidor)

**Repositório e pasta de deploy: `site-bomfim`.**  
Este workflow **não** altera o projeto **`bomfim`** (nem no GitHub nem em `/opt/bomfim` no servidor).

| Onde | Pasta / repo | Este projeto |
|------|----------------|--------------|
| GitHub | `site-bomfim` (este repo) | Sim — push e Actions aqui |
| GitHub | `bomfim` | **Não tocar** |
| Servidor | `/opt/site-bomfim` | Destino do deploy (`DEPLOY_PATH`) |
| Servidor | `/opt/bomfim` | App existente — **somente leitura** para convivência (porta, DB); **sem deploy** |

O repositório **não** envia `.env`. Crie `/opt/site-bomfim/.env` manualmente a partir de [`.env.bomfim.example`](../../.env.bomfim.example).

## Secrets do GitHub (Settings → Secrets and variables → Actions)

Configure **somente neste repositório `site-bomfim`:**

| Secret | Valor |
|--------|--------|
| `SSH_HOST` | IP ou hostname do servidor |
| `SSH_USER` | usuário SSH do deploy |
| `SSH_PRIVATE_KEY` | chave privada (conteúdo completo) |
| `SSH_PORT` | `22` (opcional) |
| `DEPLOY_PATH` | **`/opt/site-bomfim`** |

## Primeiro deploy (checklist)

### 1. GitHub (`site-bomfim` apenas)

1. Commit e push na **`main`** deste repositório.
2. Cadastre os secrets acima (não configure Actions no repo `bomfim`).
3. Confirme permissão de escrita em **`/opt/site-bomfim`**.

### 2. Servidor — preparar `/opt/site-bomfim`

```bash
sudo mkdir -p /opt/site-bomfim
sudo chown "$USER":www-data /opt/site-bomfim
chmod 775 /opt/site-bomfim

nano /opt/site-bomfim/.env
# BOMFIM_DATABASE_URL, Brevo, BOMFIM_SITE_ORIGIN
# Não copie nem sobrescreva arquivos em /opt/bomfim
```

Schema (se ainda não existir): `psql … -f /opt/site-bomfim/api/schema.sql` após o primeiro deploy.

### 3. API do site (systemd **bomfim-site-api**)

```bash
sudo cp /opt/site-bomfim/deploy/systemd/bomfim-site-api.service.example \
        /etc/systemd/system/bomfim-site-api.service
sudo systemctl daemon-reload
sudo systemctl enable bomfim-site-api
```

Variáveis opcionais no `.env`:

```bash
BOMFIM_SYSTEMD_SERVICE=bomfim-site-api
BOMFIM_API_PORT=5183
```

Se **`5183`** já for usada por `/opt/bomfim`, escolha outra porta e ajuste systemd + Apache **apenas para o site**.

### 4. Apache

Build com base `/site-bomfim/` ([`vite.config.js`](../../vite.config.js)):

- Estáticos: **`/opt/site-bomfim/dist/`** + `.htaccess` deste repo.
- Proxy: `/site-bomfim/api/` → `127.0.0.1:5183/api/` (ou porta do `.env`).

Não edite vhosts ou units do app em **`/opt/bomfim`** por causa deste deploy.

### 5. Disparar

- Push na `main`, ou **Actions → Deploy site + API → Run workflow**.

Fluxo: build → SCP **só para `DEPLOY_PATH`** → `post-deploy.sh` → `systemctl restart bomfim-site-api`.

## Fluxo contínuo

- **Código:** push em `site-bomfim` → atualiza `/opt/site-bomfim`.
- **Só `.env`:** Actions → **Reiniciar API (ler .env)** ou  
  `cd /opt/site-bomfim && bash scripts/server/restart-services.sh`.

## Desenvolvimento local

`python run.py` (site + API). Produção: `python run.py --api-only` via `bomfim-site-api`.