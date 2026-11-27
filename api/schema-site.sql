-- Bomfim site content (PostgreSQL database: site)
-- Apply with: psql "$BOMFIM_SITE_DATABASE_URL" -v ON_ERROR_STOP=1 -f api/schema-site.sql

CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION bomfim_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS gerente (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    cargo TEXT NOT NULL DEFAULT 'Gerência da unidade',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS gerente_email_ativo_lower_idx
    ON gerente (lower(email))
    WHERE ativo AND email IS NOT NULL;

CREATE TABLE IF NOT EXISTS unidade (
    id BIGSERIAL PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    estado TEXT NOT NULL,
    uf CHAR(2) NOT NULL,
    endereco TEXT NOT NULL,
    telefone TEXT NOT NULL,
    imagem TEXT NOT NULL,
    hub TEXT,
    ordem SMALLINT NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    gerente_id BIGINT NOT NULL REFERENCES gerente (id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS unidade_uf_idx ON unidade (uf);
CREATE INDEX IF NOT EXISTS unidade_gerente_id_idx ON unidade (gerente_id);
CREATE INDEX IF NOT EXISTS unidade_ativo_ordem_idx ON unidade (ativo, ordem);

DROP TRIGGER IF EXISTS gerente_set_updated_at ON gerente;
CREATE TRIGGER gerente_set_updated_at
    BEFORE UPDATE ON gerente
    FOR EACH ROW
    EXECUTE PROCEDURE bomfim_set_updated_at();

DROP TRIGGER IF EXISTS unidade_set_updated_at ON unidade;
CREATE TRIGGER unidade_set_updated_at
    BEFORE UPDATE ON unidade
    FOR EACH ROW
    EXECUTE PROCEDURE bomfim_set_updated_at();

COMMENT ON TABLE gerente IS 'Gerentes de unidade; um gerente pode atender mais de uma unidade.';
COMMENT ON COLUMN gerente.nome IS 'Nome exibido na página de unidades.';
COMMENT ON COLUMN gerente.email IS 'E-mail de contato da gerência (mailto na UI).';
COMMENT ON COLUMN gerente.telefone IS 'Telefone direto do gerente, se houver.';
COMMENT ON COLUMN gerente.cargo IS 'Cargo exibido junto ao nome; padrão Gerência da unidade.';
COMMENT ON COLUMN gerente.ativo IS 'Gerentes inativos permanecem no banco mas não devem ser publicados no site.';

COMMENT ON TABLE unidade IS 'Unidades Bomfim publicadas no site (/unidades).';
COMMENT ON COLUMN unidade.codigo IS 'Slug estável; deve alinhar com unit_code em bomfim_coverage_base quando possível.';
COMMENT ON COLUMN unidade.hub IS 'Polo comercial / município de referência da operação.';
COMMENT ON COLUMN unidade.ordem IS 'Ordem de exibição na listagem (menor primeiro).';
COMMENT ON COLUMN unidade.gerente_id IS 'Gerente desta unidade (N:1 — o mesmo gerente pode ter várias unidades).';
COMMENT ON COLUMN unidade.imagem IS 'Nome do arquivo em public/assets/units/.';