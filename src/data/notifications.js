export const notifications = [
  {
    id: 'weather',
    type: 'weather',
    label: 'Clima',
    title: 'Chuva e mau tempo podem afetar entregas',
    body: 'Chuva intensa e condições de mau tempo podem reduzir a velocidade do transporte e comprometer a previsão de entrega em rotas afetadas.',
    impact: 'A previsão pode mudar conforme as condições do trecho e a avaliação operacional.',
    status: 'Exemplo de aviso',
  },
  {
    id: 'unit',
    type: 'unit',
    label: 'Unidade',
    title: 'Alteração temporária no atendimento de uma unidade',
    body: 'Modelo para comunicar mudanças temporárias de atendimento, incluindo unidade, período, impacto e alternativa confirmados pela operação.',
    impact: 'Unidade e período serão informados após validação operacional.',
    status: 'Modelo de aviso',
  },
  {
    id: 'route',
    type: 'route',
    label: 'Rota',
    title: 'Condição em trecho rodoviário',
    body: 'Modelo para informar interdições, condições da via ou outros fatores que possam alterar o fluxo de uma rota.',
    impact: 'Trecho, período e entregas afetadas serão informados após validação.',
    status: 'Modelo de aviso',
  },
]
