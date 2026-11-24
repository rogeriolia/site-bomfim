const additionalServices = [
  ['paletizacao', 'Paletização', 'Prepare a carga para ser movimentada com mais estabilidade, segurança e previsibilidade.', 'Se sua carga passa por docas, transferências ou armazenagem, a forma como ela é unitizada interfere diretamente na operação. A paletização organiza volumes em uma base adequada ao manuseio, reduz o risco de avarias e facilita a conferência. A Bomfim avalia o produto, a embalagem, o peso e o percurso antes de definir a melhor condição.', 'Quando o manuseio da carga impacta prazo, integridade ou produtividade', 'Informe como a carga chega hoje, quais problemas acontecem no manuseio e em quais etapas ela será movimentada. Isso permite discutir o padrão de palete, a identificação e os cuidados necessários.', ['Tipo de mercadoria e embalagem', 'Quantidade, peso e dimensões dos volumes', 'Equipamentos e etapas de movimentação', 'Necessidade de armazenagem ou transferência'], '/assets/visuals-2026/11-armazenagem.webp'],
  ['armazenagem', 'Armazenagem', 'Use a estrutura da Bomfim para organizar o estoque entre a origem e a distribuição.', 'A armazenagem pode apoiar sua empresa quando o estoque precisa de um ponto de passagem, consolidação ou redistribuição. Mais do que disponibilizar espaço, a operação precisa preservar a identificação da carga, organizar entradas e saídas e respeitar as características de cada produto. O desenho depende do volume, do tempo de permanência e do fluxo esperado.', 'Quando sua operação precisa de espaço sem perder controle sobre o estoque', 'Para avaliar a solução, compartilhe o perfil dos produtos, a variação dos volumes, o tempo médio de permanência e o que precisa acontecer antes da entrega ao destino.', ['Perfil, dimensões e cuidados da carga', 'Volume médio, picos e sazonalidade', 'Tempo estimado de permanência', 'Frequência de entrada, separação e saída'], '/assets/visuals-2026/11-armazenagem.webp'],
  ['cross-docking', 'Cross docking', 'Reduza a permanência da carga em estoque e conecte recebimento e distribuição.', 'No cross docking, a carga chega com destino definido, é conferida e direcionada para a próxima etapa sem passar por uma armazenagem prolongada. Para quem contrata, o ganho está em coordenar horários, volumes, identificação e destinos em um mesmo fluxo. A viabilidade depende da regularidade e da sincronização da operação.', 'Quando sua carga precisa chegar, ser organizada e seguir rapidamente para diferentes destinos', 'Apresente os horários de chegada e saída, a quantidade de destinos, a frequência da operação e os critérios que precisam ser conferidos antes da expedição.', ['Janelas de recebimento e expedição', 'Destinos, frequência e volume por saída', 'Regras de conferência e identificação', 'Responsáveis por cada etapa'], '/assets/visuals-2026/07-carregamento.webp'],
  ['agendamentos', 'Agendamentos', 'Coordene janelas de recebimento e entrega para evitar tentativas improdutivas e atrasos.', 'Se o seu cliente, loja ou centro de distribuição recebe somente em determinados horários, essa exigência precisa entrar no planejamento desde a cotação. A Bomfim avalia a janela, o endereço, as condições de acesso e os contatos responsáveis para alinhar a entrega e reduzir desencontros na operação.', 'Quando o destinatário tem horário, doca ou procedimento obrigatório para receber', 'Informe a janela real de recebimento, os contatos, as restrições do local e o impacto de uma entrega fora do horário. Esses detalhes ajudam a construir uma proposta aderente à rotina do destinatário.', ['Janela de recebimento e tolerância', 'Contato do destinatário', 'Restrições de acesso, doca ou veículo', 'Procedimentos e documentos exigidos'], '/assets/visuals-2026/15-equipe.webp'],
  ['e-commerce', 'E-commerce', 'Dê escala às entregas do seu comércio digital sem perder visibilidade sobre o pedido.', 'No e-commerce, o transporte participa diretamente da experiência de compra. A operação precisa lidar com muitos pedidos, volumes variados, endereços diferentes e expectativa de acompanhamento. A Bomfim avalia origem, regiões atendidas, perfil dos produtos e necessidade de comprovantes para discutir uma distribuição compatível com seu negócio.', 'Quando o crescimento dos pedidos começa a pressionar expedição, transporte e atendimento', 'Leve uma visão do volume médio e dos picos, as regiões de entrega, o perfil dos pedidos e os principais motivos de contato ou ocorrência após a venda.', ['Origem e regiões de entrega', 'Volume médio e picos de pedidos', 'Peso, dimensões e perfil dos produtos', 'Necessidade de rastreio e comprovante'], '/assets/visuals-2026/14-distribuicao-urbana.webp'],
  ['last-mile', 'Last mile', 'Faça a última etapa chegar ao cliente com clareza, controle e cuidado.', 'A última milha é o momento em que a operação da sua empresa encontra o destinatário. Endereço incompleto, ausência de contato, restrição de acesso ou janela perdida podem transformar uma entrega simples em custo e frustração. Por isso, a Bomfim considera as condições reais de recebimento e os pontos que mais geram ocorrência.', 'Quando a experiência de entrega influencia recompra, relacionamento ou continuidade do negócio', 'Descreva os pontos de entrega, os horários, os contatos e as ocorrências mais comuns. Também informe quais indicadores são importantes para acompanhar a qualidade do serviço.', ['Lista de endereços ou regiões', 'Horários e contatos de recebimento', 'Perfil dos volumes e exigências do destinatário', 'Indicadores de prazo, ocorrência e comprovante'], '/assets/visuals-2026/14-distribuicao-urbana.webp'],
].map(([slug, name, title, intro, audienceTitle, processDescription, prepare, image]) => ({
  slug, name, title, intro, audience: intro, illustration: image, heroImage: image, scenesImage: image,
  scenesAlt: `${name} em uma operação logística Bomfim`, scenesHeading: 'Operação coordenada em cada etapa.', sceneCaptions: ['Preparação', 'Movimentação', 'Entrega'], visualAlt: `${name} Bomfim`,
  editorial: { audienceTitle, processTitle: 'Da necessidade ao desenho da operação', processDescription, prepareTitle: 'Informações para começar', prepareDescription: 'Quanto mais contexto você compartilhar, mais precisa será a conversa sobre o atendimento.', faqTitle: 'Dúvidas comuns' },
  steps: [['Entender o impacto no seu negócio', 'Conte o que você precisa movimentar, onde estão os gargalos e o que não pode falhar: prazo, integridade, janela, informação ou experiência do cliente.'], ['Avaliar as condições reais', 'A equipe verifica cobertura, estrutura, frequência, perfil da carga, acessos e requisitos de recebimento antes de indicar o caminho.'], ['Alinhar uma proposta possível', 'A conversa comercial organiza escopo, premissas, responsabilidades e próximos passos para que você saiba o que está sendo contratado.']],
  prepare, questions: [['A solução é indicada para qualquer operação?', 'Não existe uma solução igual para todas as empresas. A indicação depende da carga, do trecho, do volume, da frequência, da estrutura necessária e das condições de atendimento.'], ['O que preciso ter em mãos para pedir uma avaliação?', 'Comece com o que você já sabe: origem, destino, tipo de produto, volume, frequência, prazo desejado e principal dificuldade. A equipe ajuda a identificar os dados que faltam.'], ['Como a Bomfim define o que será contratado?', 'A proposta deve considerar o cenário informado, as etapas incluídas, as condições de atendimento e as responsabilidades de cada parte. Confirme esses pontos antes de aprovar.'], ['A Bomfim pode combinar soluções?', 'Sim. Uma operação pode envolver transporte, armazenagem, distribuição, agendamento e acompanhamento em conjunto. A combinação depende da necessidade e da viabilidade operacional.']],
  primary: { label: 'Falar com comercial', href: '/contato' }, secondary: { label: 'Solicitar cotação', href: '/cotacao' },
}))

export const services = [
{
    "slug": "carga-fracionada",
    "name": "Carga fracionada",
    "metaDescription": "Entenda quando usar carga fracionada, quais dados informar na cotação e o que confirmar sobre volumes, cubagem, coleta e entrega com a Bomfim.",
    "title": "Sua carga segue pelo caminho certo, no tamanho certo.",
    "intro": "Na carga fracionada, remessas de diferentes empresas compartilham o transporte. É uma alternativa para enviar caixas, peças ou volumes embalados, conforme o perfil da mercadoria e o atendimento na origem e no destino.",
    "illustration": "/assets/services/carga-fracionada-3d.webp",
    "heroImage": "/assets/visuals-2026/06-conferencia.webp",
    "scenesImage": "/assets/services/carga-fracionada-scenes.webp",
    "scenesAlt": "Três momentos da carga fracionada: conferência conjunta de volumes, medição de uma embalagem e carregamento seguro no caminhão.",
    "scenesHeading": "Cada volume passa por uma etapa de cuidado.",
    "sceneCaptions": ["Volumes conferidos", "Medidas da embalagem", "Carga preparada para embarque"],
    "visualAlt": "Representação de volumes organizados em um armazém para embarque em caminhão",
    "audience": "Para empresas que abastecem clientes, repõem mercadorias ou transferem estoques entre cidades, sem precisar reservar um veículo exclusivo. A escolha considera o peso, o espaço ocupado, as condições de manuseio e a compatibilidade da carga com o serviço.",
    "editorial": {
        "audienceTitle": "Quando a carga fracionada faz sentido",
        "processTitle": "Do pedido de cotação ao acompanhamento",
        "processDescription": "Começamos pelas informações da remessa. Elas ajudam a conferir o atendimento, definir o serviço e esclarecer as condições antes da contratação.",
        "prepareDescription": "Pode começar com o que você já tem. Se algum dado estiver faltando, informe isso no contato para que a avaliação considere essa pendência.",
        "faqTitle": "Dúvidas comuns"
    },
    "steps": [
        [
            "Descreva a carga e o trajeto",
            "Informe as cidades, a mercadoria, a quantidade de volumes, o peso e as dimensões. Avise também se há agendamento ou alguma condição de acesso na coleta ou na entrega."
        ],
        [
            "Confira a proposta antes do embarque",
            "Confirme o prazo para o trecho, o que está incluído no serviço e as condições de coleta e entrega. Embalagem, identificação e documentos precisam estar preparados para a expedição."
        ],
        [
            "Acompanhe pelos canais de atendimento",
            "Depois da contratação, utilize o portal oficial e os canais Bomfim para consultar a movimentação. Tenha em mãos a referência do embarque para facilitar o atendimento."
        ]
    ],
    "prepare": [
        "Origem e destino: cidade, UF e CEP dos dois endereços",
        "Volumes: quantidade e medidas externas da embalagem pronta",
        "Carga: tipo de mercadoria, peso total e valor declarado",
        "Atendimento: necessidade de coleta, agendamento e restrições de acesso"
    ],
    "questions": [
        [
            "Carga fracionada é apenas para cargas pequenas?",
            "Não há um único tamanho que defina a modalidade. A remessa divide o transporte com outras cargas; por isso, peso, dimensões, mercadoria e trajeto precisam ser avaliados juntos."
        ],
        [
            "Por que preciso informar as dimensões?",
            "O espaço ocupado também influencia o planejamento e a cotação. A cubagem relaciona esse espaço ao peso considerado na cobrança. Peça o critério da proposta e informe as medidas da embalagem já pronta para embarque."
        ],
        [
            "Posso enviar qualquer mercadoria?",
            "Não. Há itens não transportados e mercadorias que exigem condições específicas. Descreva o produto e a embalagem antes de contratar; a equipe confirma se o perfil da carga pode ser atendido."
        ],
        [
            "Como confirmo o prazo de entrega?",
            "Informe os endereços de origem e destino e a data em que a carga estará disponível. O prazo deve ser confirmado para esse embarque, considerando o atendimento no trecho e eventuais agendamentos."
        ],
        [
            "E quando os envios se repetem toda semana?",
            "Vale reunir os destinos, a frequência e o volume habitual. Assim, o time comercial pode avaliar a rotina de embarques, além de uma remessa isolada."
        ]
    ],
    "primary": {
        "label": "Solicitar cotação",
        "href": "/cotacao"
    },
    "secondary": {
        "label": "Consultar rotas",
        "href": "/rotas"
    }
},
  {
    slug: 'embarques-recorrentes', name: 'Embarques recorrentes',
    title: 'Organize seus embarques recorrentes.',
    intro: 'Organize os destinos, a frequência e os pontos de coleta dos embarques que se repetem. Essas informações ajudam a planejar o abastecimento da sua empresa.',
    editorial: {
      audienceTitle: 'Quando os embarques se repetem',
      processTitle: 'Organize destinos, frequência e volumes',
      processDescription: 'O histórico de saídas ajuda a identificar os corredores prioritários, os períodos de maior demanda e os pontos que exigem alinhamento operacional.',
      prepareTitle: 'Dados para mapear sua rotina',
      prepareDescription: 'Comece pelas rotas mais frequentes e indique onde há variações de volume, sazonalidade ou horários de recebimento.',
      faqTitle: 'Dúvidas comuns'
    },
    illustration: '/assets/services/embarques-recorrentes-3d.webp',
    heroImage: '/assets/visuals-2026/07-carregamento.webp',
    scenesImage: '/assets/services/embarques-recorrentes-scenes.webp',
    scenesAlt: 'Mapa regional entre Natal, Maceió e Recife, frota em pátio logístico e reposição recorrente em um centro de distribuição.',
    scenesHeading: 'Rotas bem definidas, saídas mais claras.',
    sceneCaptions: ['Corredores do Nordeste', 'Saídas planejadas', 'Reposição recorrente'],
    visualAlt: 'Ilustração 3D de dois caminhões em corredores distintos conectando um centro de distribuição a empresas',
    audience: 'Para operações com embarques semanais ou diários, múltiplos destinos ou necessidade de alinhar uma rotina com o transportador.',
    steps: [
      ['Mapear o padrão', 'Identifique origens, destinos principais, sazonalidade e frequência de saída.'],
      ['Priorizar corredores', 'Reúna as rotas que concentram o maior impacto na sua operação.'],
      ['Alinhar o atendimento', 'O time comercial avalia condições, pontos de coleta e necessidades de acompanhamento.'],
    ],
    prepare: ['Lista de origens e destinos principais', 'Frequência estimada por rota', 'Perfil dos volumes e variação mensal', 'Pontos críticos de coleta e entrega'],
    questions: [
      ['Preciso ter todos os dados consolidados?', 'Não. É possível começar qualitativamente, pelas rotas prioritárias e pelos desafios percebidos na operação.'],
      ['Uma conversa pode incluir várias rotas?', 'Sim. O planejador permite reunir corredores e destinos adicionais antes do contato comercial.'],
      ['A frequência garante uma condição específica?', 'Não automaticamente. Frequência, rota e perfil da carga são avaliados em conjunto.'],
    ],
    primary: { label: 'Planejar minhas rotas', href: '/rotas' }, secondary: { label: 'Falar com comercial', href: '/contato' },
  },
  {
    slug: 'coleta-programada', name: 'Coleta programada',
    title: 'Agende a coleta da sua carga.',
    intro: 'Informe o endereço, a disponibilidade e os volumes da carga para avaliar a coleta. A equipe confirma as condições e a janela de atendimento.',
    editorial: {
      audienceTitle: 'Quando a coleta precisa acompanhar sua expedição',
      processTitle: 'Da carga pronta à confirmação da janela',
      processDescription: 'Endereço, acesso ao local, volumes e disponibilidade ajudam a equipe a avaliar a retirada. A solicitação inicia a análise; o agendamento depende de confirmação.',
      prepareTitle: 'O que informar para avaliar a coleta',
      prepareDescription: 'Inclua um contato no local e sinalize restrições de acesso, horários de expedição ou necessidade de agendamento.',
      faqTitle: 'Dúvidas comuns'
    },
    illustration: '/assets/services/coleta-programada-3d.webp',
    heroImage: '/assets/visuals-2026/03-hero-coleta.webp',
    scenesImage: '/assets/services/coleta-programada-scenes.webp',
    scenesAlt: 'Carga pronta na doca, equipe confirmando volumes no local de coleta e caminhão chegando para a retirada.',
    scenesHeading: 'Da carga pronta à retirada confirmada.',
    sceneCaptions: ['Carga identificada', 'Conferência no local', 'Retirada alinhada'],
    visualAlt: 'Ilustração 3D de equipe conferindo volumes junto a um caminhão leve em uma doca de coleta',
    audience: 'Para empresas que desejam solicitar a retirada da carga em um endereço de origem, seja em um embarque pontual ou em uma rotina recorrente.',
    steps: [
      ['Preparar a carga', 'Organize identificação, volumes e informações necessárias para o embarque.'],
      ['Informar o local', 'Compartilhe cidade, endereço e condições de acesso para análise da coleta.'],
      ['Confirmar a janela', 'A data e o período dependem de validação operacional; a solicitação por si só não confirma o agendamento.'],
    ],
    prepare: ['Endereço completo e contato no local', 'Quantidade de volumes, peso e dimensões', 'Condições de acesso e horário do estabelecimento', 'Destino e data desejada'],
    questions: [
      ['Solicitar a coleta já confirma uma data?', 'Não. A solicitação inicia a avaliação; disponibilidade e janela são confirmadas posteriormente pelos canais oficiais.'],
      ['Posso informar particularidades do acesso?', 'Sim. Docas, restrições de veículos e horários são informações úteis para a análise.'],
      ['E se a carga ainda não estiver pronta?', 'Informe a data desejada e as condições previstas. A preparação deve ser alinhada antes da confirmação.'],
    ],
    primary: { label: 'Solicitar coleta', href: '/coleta' }, secondary: { label: 'Ver como preparar a carga', href: '/conteudos' },
  },
  {
    slug: 'distribuicao-personalizada', name: 'Distribuição personalizada',
    title: 'Planeje entregas para vários destinos.',
    intro: 'Planeje a distribuição aos clientes e as transferências de estoque entre filiais. Cidades, frequência e condições de recebimento ajudam a definir a operação.',
    editorial: {
      audienceTitle: 'Quando atender vários destinos exige coordenação',
      processTitle: 'Da lista de destinos ao desenho da operação',
      processDescription: 'O planejamento considera as cidades, a frequência, o perfil das cargas e as particularidades de recebimento para avaliar as etapas de distribuição.',
      prepareTitle: 'Informações para planejar a distribuição',
      prepareDescription: 'Agrupe os destinos por região e indique frequência, horários de recebimento e pontos que precisam de tratamento específico.',
      faqTitle: 'Dúvidas comuns'
    },
    illustration: '/assets/services/distribuicao-personalizada-3d.webp',
    heroImage: '/assets/visuals-2026/15-equipe.webp',
    scenesImage: '/assets/services/distribuicao-personalizada-scenes.webp',
    scenesAlt: 'Mapa regional de Recife, Maceió e Natal, pátio de distribuição e entrega de volumes em um comércio local.',
    scenesHeading: 'Destinos conectados na sua operação.',
    sceneCaptions: ['Destinos no Nordeste', 'Pátio de distribuição', 'Entrega no ponto combinado'],
    visualAlt: 'Ilustração 3D de um armazém, caminhão regional e veículos leves atendendo diferentes destinos urbanos',
    audience: 'Para empresas com rede de destinos, requisitos de entrega específicos ou necessidade de combinar diferentes etapas de distribuição.',
    steps: [
      ['Reunir destinos', 'Liste capitais, cidades do interior e pontos que exigem atenção especial.'],
      ['Descrever a demanda', 'Frequência, perfil da carga e variações ajudam a identificar o que precisa de desenho próprio.'],
      ['Avaliar alternativas', 'O time comercial verifica a cobertura e as condições possíveis para a operação.'],
    ],
    prepare: ['Origens e lista de destinos', 'Frequência de expedição e variação de volume', 'Características dos pontos de entrega', 'Indicadores ou desafios atuais, se houver'],
    questions: [
      ['Todas as cidades aparecem no planejador?', 'Não. O planejador destaca corredores de referência e permite acrescentar cidades para avaliação.'],
      ['Preciso enviar uma planilha?', 'Não para começar. Uma descrição qualitativa das rotas e do desafio já permite iniciar a conversa.'],
      ['A distribuição personalizada inclui o interior?', 'Cidades do interior podem ser avaliadas conforme a cobertura e as condições da operação, sem promessa automática de atendimento.'],
    ],
    primary: { label: 'Montar minha seleção de rotas', href: '/rotas' }, secondary: { label: 'Falar com comercial', href: '/contato' },
  },
  ...additionalServices,
]

export const serviceBySlug = Object.fromEntries(services.map(service => [service.slug, service]))
