export const navigation = [
  {
    "label": "Estrutura",
    "href": "/estrutura",
    "action": {
      "label": "Conhecer nossa estrutura",
      "href": "/estrutura"
    },
    "children": [
      {
        "label": "Unidades Bomfim",
        "description": "Consulte endereços e contatos das unidades.",
        "href": "/unidades"
      },
      {
        "label": "Operação e processos",
        "description": "Conheça as etapas de conferência e movimentação da carga.",
        "href": "/estrutura"
      },
      {
        "label": "Tecnologia e acompanhamento",
        "description": "Entenda como os sistemas apoiam o controle dos embarques.",
        "href": "/tecnologia"
      },
      {
        "label": "Sobre a Bomfim",
        "description": "Conheça nossa história e atuação no Nordeste.",
        "href": "/quem-somos"
      }
    ]
  },
  {
    "label": "Soluções",
    "href": "/solucoes",
    "action": {
      "label": "Ver todas as soluções",
      "href": "/solucoes"
    },
    "groups": [
      {
        "label": "Transporte",
        "children": [
          {
            "label": "Carga fracionada",
            "description": "Envie volumes sem contratar um veículo exclusivo.",
            "href": "/solucoes/carga-fracionada"
          },
          {
            "label": "Embarques recorrentes",
            "description": "Planeje os envios que fazem parte da rotina da empresa.",
            "href": "/solucoes/embarques-recorrentes"
          }
        ]
      },
      {
        "label": "Coleta e distribuição",
        "children": [
          {
            "label": "Coleta programada",
            "description": "Organize a retirada da carga no endereço de origem.",
            "href": "/solucoes/coleta-programada"
          },
          {
            "label": "Distribuição personalizada",
            "description": "Planeje entregas para clientes e transferências entre filiais.",
            "href": "/solucoes/distribuicao-personalizada"
          },
          {
            "label": "Agendamentos",
            "description": "Alinhe horários e condições de coleta ou recebimento.",
            "href": "/solucoes/agendamentos"
          }
        ]
      },
      {
        "label": "Armazenagem e movimentação",
        "children": [
          {
            "label": "Armazenagem",
            "description": "Organize o estoque e o fluxo de entrada e saída.",
            "href": "/solucoes/armazenagem"
          },
          {
            "label": "Cross-docking",
            "description": "Conecte recebimento e expedição sem armazenagem prolongada.",
            "href": "/solucoes/cross-docking"
          },
          {
            "label": "Paletização",
            "description": "Agrupe volumes em paletes para facilitar o manuseio.",
            "href": "/solucoes/paletizacao"
          }
        ]
      },
      {
        "label": "Entrega ao destinatário",
        "children": [
          {
            "label": "E-commerce",
            "description": "Planeje a distribuição dos pedidos da sua loja virtual.",
            "href": "/solucoes/e-commerce"
          },
          {
            "label": "Last mile",
            "description": "Organize a etapa final da entrega ao destinatário.",
            "href": "/solucoes/last-mile"
          }
        ]
      }
    ]
  },
  {
    "label": "Cobertura",
    "href": "/rotas",
    "action": {
      "label": "Conhecer nossa cobertura",
      "href": "/rotas"
    },
    "children": [
      {
        "label": "Consultar cidades e CEPs",
        "description": "Consulte a base de localidades atendidas pela Bomfim.",
        "href": "/rotas"
      },
      {
        "label": "Planejar minha operação",
        "description": "Reúna origem, destinos e frequência dos embarques.",
        "href": "/rotas/planejar"
      },
      {
        "label": "Encontrar uma unidade",
        "description": "Localize uma unidade e consulte seus contatos.",
        "href": "/unidades"
      }
    ]
  },
  {
    "label": "Comercial",
    "href": "/comercial",
    "children": [
      {
        "label": "Solicitar cotação",
        "description": "Informe o trajeto e os dados de um embarque.",
        "href": "/cotacao"
      },
      {
        "label": "Solicitar coleta",
        "description": "Informe o endereço e a carga disponível para retirada.",
        "href": "/coleta"
      },
      {
        "label": "Falar com o comercial",
        "description": "Converse sobre frequência, volume e necessidades da operação.",
        "href": "/comercial"
      }
    ]
  },
  {
    "label": "Conteúdos",
    "href": "/conteudos"
  }
]

export const footerGroups = [
  { title: 'Empresa', links: [
    { label: 'Quem somos', href: '/quem-somos' }, { label: 'Estrutura', href: '/estrutura' }, { label: 'Tecnologia', href: '/tecnologia' }, { label: 'Conteúdos', href: '/conteudos' },
  ] },
  { title: 'Soluções e cobertura', links: [
    { label: 'Nossas soluções', href: '/solucoes' }, { label: 'Rotas e destinos', href: '/rotas' }, { label: 'Planejar minha operação', href: '/rotas/planejar' }, { label: 'Nossas unidades', href: '/unidades' },
  ] },
  { title: 'Atendimento', links: [
    { label: 'Falar com comercial', href: '/comercial' }, { label: 'Solicitar cotação', href: '/cotacao' }, { label: 'Solicitar coleta', href: '/coleta' }, { label: 'Área do Cliente', href: '/area-do-cliente' }, { label: 'Entre em contato', href: '/contato' },
  ] },
]
