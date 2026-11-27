-- Vários unidade.gerente_id podem apontar para o mesmo gerente (N:1).

ALTER TABLE unidade DROP CONSTRAINT IF EXISTS unidade_gerente_id_key;

CREATE INDEX IF NOT EXISTS unidade_gerente_id_idx ON unidade (gerente_id);

COMMENT ON COLUMN unidade.gerente_id IS 'Gerente responsável por esta unidade (o mesmo gerente pode atender mais de uma unidade).';
COMMENT ON TABLE gerente IS 'Gerentes de unidade; um gerente pode estar ligado a várias unidades.';