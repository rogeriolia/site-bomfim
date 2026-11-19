const base = '/assets/visuals-2026/'

export const visualLibrary = [
  { id: '01', file: '01-hero-pessoas.webp', title: 'Pessoas e operação', use: 'Hero institucional e conversa comercial', alt: 'Equipe de logística reunida em centro de distribuição com caminhão ao fundo' },
  { id: '02', file: '02-hero-estrutura.webp', title: 'Estrutura em movimento', use: 'Hero da página Estrutura', alt: 'Profissionais conferindo cargas em um centro de distribuição' },
  { id: '03', file: '03-hero-coleta.webp', title: 'Coleta urbana', use: 'Home recorrente e coleta', alt: 'Caminhão leve em ponto de coleta de carga' },
  { id: '04', file: '04-hero-atendimento.webp', title: 'Atendimento operacional', use: 'Landing de consideração', alt: 'Profissional de atendimento acompanha documentos de transporte' },
  { id: '05', file: '05-hero-corredores.webp', title: 'Corredores rodoviários', use: 'Hero da home e campanhas', alt: 'Caminhão de carga em corredor rodoviário ao entardecer' },
  { id: '06', file: '06-conferencia.webp', title: 'Conferência de carga', use: 'Home e solução de carga fracionada', alt: 'Equipe confere cargas paletizadas e documentos' },
  { id: '07', file: '07-carregamento.webp', title: 'Carregamento', use: 'Soluções e processo de embarque', alt: 'Equipe coordena o carregamento de caminhão no centro de distribuição' },
  { id: '08', file: '08-motorista.webp', title: 'Motorista e coordenação', use: 'Embarques recorrentes', alt: 'Motorista e coordenador conferem manifesto ao lado de caminhão' },
  { id: '09', file: '09-frota-leve.webp', title: 'Frota leve', use: 'Componente de frota e distribuição urbana', alt: 'Dois caminhões leves de entrega em centro logístico' },
  { id: '10', file: '10-atendimento.webp', title: 'Acompanhamento', use: 'Área do Cliente e landing de retorno', alt: 'Profissional acompanha operação em posto de atendimento' },
  { id: '11', file: '11-armazenagem.webp', title: 'Armazenagem', use: 'Home e página Estrutura', alt: 'Armazém organizado com equipe, paletes e empilhadeira' },
  { id: '12', file: '12-triagem.webp', title: 'Triagem e leitura', use: 'Conteúdo editorial e processos', alt: 'Operador lê etiqueta de caixa durante triagem de carga' },
  { id: '13', file: '13-qualidade.webp', title: 'Controle de qualidade', use: 'Estrutura e carga fracionada', alt: 'Supervisora inspeciona embalagem com colega no armazém' },
  { id: '14', file: '14-distribuicao-urbana.webp', title: 'Distribuição B2B', use: 'Soluções e distribuição personalizada', alt: 'Motorista entrega volume em estabelecimento comercial com caminhão leve' },
  { id: '15', file: '15-equipe.webp', title: 'Equipe Bomfim', use: 'Quem somos e cultura', alt: 'Profissionais de logística em conversa operacional no armazém' },
  { id: '16', file: '16-hero-home-recorrente.webp', title: 'Operação acompanhada de perto', use: 'Hero da home para acessos recorrentes', alt: 'Profissional conferindo carga com leitor portátil em centro de distribuição' },
  { id: '17', file: '17-banner-cobertura.webp', title: 'Cobertura regional', use: 'Faixa de cobertura na página de Rotas', alt: 'Caminhão em corredor rodoviário ao fim da tarde' },
].map(item => ({ ...item, src: `${base}${item.file}` }))
