# Deploy seguro (GitHub → servidor)

**Repositório e pasta de deploy: `site-bomfim`.**  
Este workflow **não** altera o projeto **`bomfim`** (nem no GitHub nem em `/opt/bomfim` no servidor).

| Onde | Pasta / repo | Este projeto |
|------|----------------|--------------|
| GitHub | `site-bomfim` (este repo) | Sim — push e Actions aqui |
| GitHub | `bomfim` | **Não tocar** |
| Servidor | `/opt/site-bomfim` | Destino fixo do deploy (ver workflow) |
| Servidor | `/opt/bomfim` | App existente — **somente leitura**; **sem deploy** |

O repositório **não** envia `.env`. Crie `/opt/site-bomfim/.env` manualmente a partir de [`.env.bomfim.example`](../../.env.bomfim.example). O `post-deploy.sh` preserva esse arquivo entre deploys.

---

## Dia a dia (após configuração única)

1. **`git push origin main`** (ou merge na `main`).
2. Aguarde **Actions → Deploy site + API** ficar verde.
3. Valide o site em `https://site-bomfim.4lia.com.br/site-bomfim/` (Vultr).
4. **Só mudou `.env` no servidor?** Não precisa push de código: **Actions → Reiniciar API (ler .env)**.

Não é necessário alterar secrets, nginx, systemd ou permissões a cada push — o workflow roda build → SCP → `post-deploy.sh` (venv, permissões `www-data`, systemd, restart).

**Diagnóstico sem deploy completo:** **Actions → Verificar conexão deploy** (só testa SSH, pasta, `.env` e serviço).

---

## Configuração única (uma vez)

Faça isso **uma vez** (ou quando mudar servidor/chave). Depois use apenas o fluxo [dia a dia](#dia-a-dia-após-configuração-única).

### 1. Secrets no GitHub

**Settings → Secrets and variables → Actions** neste repo `site-bomfim`:

| Secret | Obrigatório | Valor |
|--------|-------------|--------|
| `SSH_HOST` | Sim | IP ou hostname do Vultr |
| `SSH_USER` | Sim | em geral `root` |
| `SSH_PRIVATE_KEY` | Sim | chave privada completa |
| `SSH_PORT` | Não | padrão `22` |

O destino **`/opt/site-bomfim`** está fixo no workflow — **não** é preciso secret `DEPLOY_PATH` (pode remover se existir).

Passo a passo da chave: [deploy-ssh-github.md](./deploy-ssh-github.md).

### 2. Servidor Vultr

```bash
sudo mkdir -p /opt/site-bomfim
nano /opt/site-bomfim/.env   # BOMFIM_DATABASE_URL, Brevo, BOMFIM_SITE_ORIGIN
```

Schema: após o primeiro deploy com DB configurado, `post-deploy.sh` chama `ensure-schema.sh` (ou manual: `bash scripts/server/ensure-schema.sh`).

### 3. Primeira publicação

Ordem sugerida:

1. **PC:** `ssh -i ~/.ssh/site_bomfim_deploy root@SEU_IP "echo ok"`
2. **GitHub:** secrets acima
3. **Actions:** *Deploy site + API* → Run workflow (ou [bootstrap](#bootstrap-imediato-no-vultr-sem-actions) no Vultr)
4. **nginx (uma vez):** `deploy/nginx/site-bomfim.4lia.com.br.conf.example`
5. **KingHost (se URL final for `www.4lia.com.br`):** copiar `dist/` + `.htaccess`; proxy `/api/` para a VPS

O `post-deploy.sh` instala a unit `bomfim-site-api` na primeira vez, ajusta dono `www-data` e reinicia a API.

### 4. systemd e porta

Serviço: **`bomfim-site-api`** (exemplo em `deploy/systemd/`). Porta padrão **5183** (`BOMFIM_API_PORT` no `.env` se conflitar com `/opt/bomfim`).

---

## Bootstrap imediato no Vultr (sem Actions)

```bash
sudo apt install -y git nodejs npm zip
curl -fsSL https://raw.githubusercontent.com/rogeriolia/site-bomfim/main/scripts/server/bootstrap-from-github.sh -o /tmp/bootstrap.sh
sudo bash /tmp/bootstrap.sh
```

(Preserva `/opt/site-bomfim/.env` se já existir.)

---

## Apache / nginx

Build com base `/site-bomfim/` ([`vite.config.js`](../../vite.config.js)):

- Estáticos: **`/opt/site-bomfim/dist/`** + `.htaccess` deste repo.
- Proxy: `/site-bomfim/api/` → `127.0.0.1:5183/api/` (ou porta do `.env`).

Exemplo nginx na VPS: [`deploy/nginx/site-bomfim.4lia.com.br.conf.example`](../../deploy/nginx/site-bomfim.4lia.com.br.conf.example).

Não edite vhosts ou units do app em **`/opt/bomfim`** por causa deste deploy.

---

## Fora do push automático

| Tarefa | Como |
|--------|------|
| `.env` em produção | Editar no servidor → **Reiniciar API (ler .env)** |
| Site na KingHost | Upload manual de `dist/` (não está no GitHub Actions) |
| Trocar IP ou chave SSH | Atualizar secrets (configuração única de novo) |

---

## Desenvolvimento local

`python run.py` (site + API). Produção: `python run.py --api-only` via `bomfim-site-api`.