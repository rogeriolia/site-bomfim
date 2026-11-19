// Short operational phrases carry emphasis; headings keep their own hierarchy.
const phrases = [
  'carga fracionada', 'embarques recorrentes', 'coleta programada',
  'distribuição personalizada', 'condições de coleta e entrega',
  'peso e dimensões', 'peso, dimensões e valor', 'janelas de recebimento',
  'origem e destino', 'gerenciamento de risco', 'prazo de entrega',
  'prazos de entrega', 'perfil da carga', 'frequência de embarques',
  'rastreabilidade', 'conferência', 'armazenagem', 'paletização',
  'cross-docking', 'última milha', 'estrutura própria', 'Nordeste',
  'segurança da carga', 'comprovante de entrega', 'valor da mercadoria',
]
const pattern = new RegExp(`(${phrases.join('|')})`, 'giu')

export default function EditorialText({ children }) {
  if (typeof children !== 'string') return children
  let count = 0
  return children.split(pattern).map((part, index) => {
    const matched = index % 2 === 1
    if (matched && count < 2) { count += 1; return <strong key={index}>{part}</strong> }
    return part
  })
}
