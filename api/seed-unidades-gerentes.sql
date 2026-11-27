-- Unidades Bomfim + gerentes (cada pessoa uma vez; várias unidades podem compartilhar gerente).
-- Idempotente: não insere se já existir qualquer unidade.
-- Para repopular: TRUNCATE unidade, gerente RESTART IDENTITY CASCADE; e rode de novo.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM unidade LIMIT 1) THEN
        RAISE NOTICE 'skip: unidades já cadastradas';
        RETURN;
    END IF;

    INSERT INTO gerente (nome, email, cargo)
    VALUES
        ('Ednei Malvar', 'ednei.malvar@bomfimcargas.com.br', 'Gerência da unidade'),
        ('Tiago Dias', 'tiago.dias@bomfimcargas.com.br', 'Gerência da unidade'),
        ('Silvia Buarque', 'silvia.buarque@bomfimcargas.com.br', 'Gerência da unidade'),
        ('Marcelo Medeiros', 'maceio@bomfimcargas.com.br', 'Gerência da unidade'),
        ('Sergio Costa', 'fortaleza@bomfimcargas.com.br', 'Gerência da unidade'),
        ('Vanilson Paiva', 'aracaju@bomfimcargas.com.br', 'Gerência da unidade');

    INSERT INTO unidade (
        codigo, nome, estado, uf, endereco, telefone, imagem, hub, ordem, gerente_id
    )
    SELECT
        v.codigo,
        v.nome,
        v.estado,
        v.uf,
        v.endereco,
        v.telefone,
        v.imagem,
        v.hub,
        v.ordem,
        g.id
    FROM (
        VALUES
            (
                'recife',
                'Recife (Matriz)',
                'Pernambuco',
                'PE',
                'Rua República Eslovaca, 1271 — Galpões B1 e B2, Muribeca, Jaboatão dos Guararapes/PE · CEP 54350-195',
                '(81) 3338-8700',
                'recife.webp',
                'Jaboatão dos Guararapes',
                0,
                'ednei.malvar@bomfimcargas.com.br'
            ),
            (
                'joao-pessoa',
                'João Pessoa',
                'Paraíba',
                'PB',
                'Rua Maria Presotto Pucci, 600 — Galpão P, Distrito Industrial, João Pessoa/PB · CEP 58082-011',
                '(83) 3233-1684',
                'joao-pessoa.webp',
                'João Pessoa',
                1,
                'tiago.dias@bomfimcargas.com.br'
            ),
            (
                'feira-de-santana',
                'Feira de Santana',
                'Bahia',
                'BA',
                'Av. Centro das Indústrias, BR-324, Condomínio Grid FSA, Galpão 15A, CIS, Feira de Santana/BA · CEP 41290-550',
                '(75) 3604-1500',
                'feira-de-santana.webp',
                'Feira de Santana',
                2,
                'silvia.buarque@bomfimcargas.com.br'
            ),
            (
                'salvador',
                'Salvador',
                'Bahia',
                'BA',
                'Via Periférica Waldyr Beira, 4818, CIA Sul, Simões Filho/BA · CEP 43720-695',
                '(71) 3234-8600',
                'salvador.webp',
                'Simões Filho',
                3,
                'silvia.buarque@bomfimcargas.com.br'
            ),
            (
                'maceio',
                'Maceió',
                'Alagoas',
                'AL',
                'Rua João José Pereira Filho, 10 — Galpão 10, QD 2 Lote 1, Tabuleiro dos Martins, Maceió/AL · CEP 57081-000',
                '(82) 3221-6930',
                'maceio.webp',
                'Maceió',
                4,
                'maceio@bomfimcargas.com.br'
            ),
            (
                'natal',
                'Natal',
                'Rio Grande do Norte',
                'RN',
                'Rua Alcides Jerônimo Freire, s/n — Parque de Exposições, Parnamirim/RN · CEP 59146-470',
                '(84) 3643-3369',
                'natal.webp',
                'Parnamirim',
                5,
                'tiago.dias@bomfimcargas.com.br'
            ),
            (
                'fortaleza',
                'Fortaleza',
                'Ceará',
                'CE',
                'Rodovia BR-116, 7765, km 16 — Galpão 01, Santo Antônio, Eusébio/CE · CEP 61760-000',
                '(85) 2130-1630',
                'fortaleza.webp',
                'Eusébio',
                6,
                'fortaleza@bomfimcargas.com.br'
            ),
            (
                'aracaju',
                'Aracaju',
                'Sergipe',
                'SE',
                'Rua Paraíba, 240, Siqueira Campos, Aracaju/SE · CEP 49085-510',
                '(79) 3218-9900',
                'aracaju.webp',
                'Aracaju',
                7,
                'aracaju@bomfimcargas.com.br'
            )
    ) AS v(
        codigo,
        nome,
        estado,
        uf,
        endereco,
        telefone,
        imagem,
        hub,
        ordem,
        gerente_email
    )
    JOIN gerente g ON lower(g.email) = lower(v.gerente_email);
END $$;