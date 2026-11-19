# Corrigir SSH do GitHub Actions (erro no passo SCP)

Se no servidor **só existe `.env`**, o job falha em **Enviar release ao servidor** — build OK, **SSH não autentica** ou secrets vazios.

## Secrets obrigatórios

| Secret | Valor (exemplo Vultr root) |
|--------|----------------------------|
| `SSH_HOST` | IP público do Vultr |
| `SSH_USER` | `root` |
| `SSH_PRIVATE_KEY` | chave **privada** completa (veja abaixo) |
| `DEPLOY_PATH` | `/opt/site-bomfim` |

`SSH_PORT` — só se não for 22.

## Chave dedicada para o Actions (recomendado)

No **seu PC** (PowerShell ou Git Bash):

```bash
ssh-keygen -t ed25519 -f "$HOME/.ssh/site_bomfim_deploy" -N ""
```

No **servidor** (como root):

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cat >> ~/.ssh/authorized_keys << 'EOF'
COLE_AQUI_A_LINHA_DO_ARQUIVO_site_bomfim_deploy.pub
EOF
chmod 600 ~/.ssh/authorized_keys
```

No **GitHub** → repo `site-bomfim` → Settings → Secrets → `SSH_PRIVATE_KEY`:

- Abra `site_bomfim_deploy` (sem `.pub`)
- Cole **tudo**, incluindo `-----BEGIN OPENSSH PRIVATE KEY-----` e `-----END OPENSSH PRIVATE KEY-----`
- Sem aspas, sem espaços extras no início/fim

Teste no PC:

```bash
ssh -i ~/.ssh/site_bomfim_deploy root@SEU_IP "echo ok && ls -la /opt/site-bomfim"
```

Se isso funcionar, o Actions também deve funcionar após **Re-run** do workflow.

## Bootstrap manual no servidor (enquanto ajusta o SSH)

Com o repo **público**, no Vultr:

```bash
cd /opt/site-bomfim
# Se ainda não tem o script, clone só para copiar o script uma vez:
git clone --depth 1 https://github.com/rogeriolia/site-bomfim.git /tmp/sb-init
cp /tmp/sb-init/scripts/server/bootstrap-from-github.sh /opt/site-bomfim/scripts/server/ 2>/dev/null || mkdir -p scripts/server && cp /tmp/sb-init/scripts/server/bootstrap-from-github.sh scripts/server/
chmod +x scripts/server/bootstrap-from-github.sh
bash scripts/server/bootstrap-from-github.sh
```

Requer **git**, **nodejs**, **npm** e **zip** no servidor (`apt install -y git nodejs npm zip`).

Depois de corrigir os secrets, use o Actions de novo em pushes futuros.