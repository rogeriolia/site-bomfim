# PostgreSQL — banco `site` (unidades e gerentes)

Conteúdo publicável do site (unidades Bomfim e gerentes) fica no banco **`site`**, separado do **`bomfim_analytics`** (leads, telemetria e cobertura por CEP).

| Banco | Variável de ambiente | Schema |
|-------|----------------------|--------|
| `bomfim_analytics` | `BOMFIM_DATABASE_URL` | [`api/schema.sql`](../../api/schema.sql) |
| `site` | `BOMFIM_SITE_DATABASE_URL` | [`api/schema-site.sql`](../../api/schema-site.sql) |

## Criar o banco (uma vez)

Como superusuário ou role com `CREATEDB`:

```sql
CREATE DATABASE site ENCODING 'UTF8' TEMPLATE template0;
```

## Configurar `.env`

Copie de [`.env.bomfim.example`](../../.env.bomfim.example):

```env
BOMFIM_SITE_DATABASE_URL=postgresql://user:password@127.0.0.1:5432/site
```

## Aplicar schema e seed

No Linux/macOS (servidor ou WSL):

```bash
./scripts/server/ensure-site-schema.sh
```

Manualmente:

```bash
psql "$BOMFIM_SITE_DATABASE_URL" -v ON_ERROR_STOP=1 -f api/schema-site.sql
psql "$BOMFIM_SITE_DATABASE_URL" -v ON_ERROR_STOP=1 -f api/seed-unidades-gerentes.sql
```

O seed é idempotente: só roda quando a tabela `unidade` está vazia. Os gerentes vêm como **“A definir”** até a Bomfim preencher nome e e-mail.

## Modelo de dados

Relação **N:1**: cada `unidade` tem um `gerente_id` obrigatório; o **mesmo gerente** pode estar em várias unidades. Não é possível apagar um gerente ligado a unidades (`ON DELETE RESTRICT`); use `ativo = false`. Bancos criados antes disso: [`api/migrations/001_unidade_gerente_many_to_one.sql`](../../api/migrations/001_unidade_gerente_many_to_one.sql).

### Tabela `gerente`

| Coluna | Descrição |
|--------|-----------|
| `nome` | Nome na página |
| `email` | Contato `mailto:` (único entre ativos, se preenchido) |
| `telefone` | Opcional |
| `cargo` | Padrão: Gerência da unidade |
| `ativo` | Publicação no site |

### Tabela `unidade`

Campos espelham [`src/data/units.js`](../../src/data/units.js):

| Coluna | Descrição |
|--------|-----------|
| `codigo` | Slug (`recife`, `joao-pessoa`, …) — alinhar com `unit_code` na cobertura |
| `nome`, `estado`, `uf`, `endereco`, `telefone`, `imagem` | Dados da unidade |
| `hub` | Polo de referência (como em `unitCatchments`) |
| `ordem` | Ordem na listagem |
| `gerente_id` | FK obrigatória |

## Cadastro manual

```sql
-- 1) Gerente
INSERT INTO gerente (nome, email, cargo)
VALUES ('Maria Silva', 'maria.silva@exemplo.com.br', 'Gerência da unidade')
RETURNING id;

-- 2) Unidade (use o id retornado)
INSERT INTO unidade (
    codigo, nome, estado, uf, endereco, telefone, imagem, hub, ordem, gerente_id
) VALUES (
    'recife',
    'Recife (Matriz)',
    'Pernambuco',
    'PE',
    '...',
    '(81) 3338-8700',
    'recife.webp',
    'Jaboatão dos Guararapes',
    0,
    1
);
```

## Consulta útil (site / API futura)

```sql
SELECT
    u.codigo,
    u.nome,
    u.uf,
    u.endereco,
    u.telefone,
    u.imagem,
    u.hub,
    u.ordem,
    g.nome AS gerente_nome,
    g.email AS gerente_email,
    g.telefone AS gerente_telefone,
    g.cargo AS gerente_cargo
FROM unidade u
JOIN gerente g ON g.id = u.gerente_id
WHERE u.ativo AND g.ativo
ORDER BY u.ordem;
```

## API e frontend

- `GET /api/unidades.php` — lista unidades e gerentes ativos (`backend/routes/unidades.py`).
- [`src/pages/Units.jsx`](../../src/pages/Units.jsx) e [`CoverageModal`](../../src/components/CoverageModal.jsx) consomem essa rota via [`src/utils/unitsApi.js`](../../src/utils/unitsApi.js).
- Em desenvolvimento, `python run.py` inicia o túnel SSH quando `BOMFIM_SSH_TUNNEL` está definido (use `BOMFIM_SKIP_SSH_TUNNEL=1` no servidor).