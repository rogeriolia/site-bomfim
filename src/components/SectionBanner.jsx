import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const states = ['Alagoas', 'Bahia', 'Ceará', 'Paraíba', 'Pernambuco', 'Rio Grande do Norte', 'Sergipe']

const banners = {
  connection: {
    eyebrow: 'Transporte de carga intranordeste',
    title: 'Conectamos sua carga ao Nordeste.',
    body: 'Para abastecer clientes ou transferir estoques entre cidades, o primeiro passo é conhecer o trecho. Consulte sua rota e converse com a Bomfim sobre a carga, a frequência e os locais de entrega.',
    image: '/assets/visuals-2026/17-banner-cobertura.webp',
    action: { label: 'Consultar rotas', href: '/rotas' },
    secondary: { label: 'Falar com comercial', href: '/contato' },
  },
  coverage: {
    eyebrow: 'Cobertura regional',
    title: 'Conhecimento local. Conversa direta.',
    body: 'Nossa equipe ajuda a avaliar origem, destino, frequência e perfil da carga antes da proposta.',
    image: '/assets/visuals-2026/17-banner-cobertura.webp',
    action: { label: 'Consultar minha rota', href: '/rotas#planejador' },
    secondary: { label: 'Falar com comercial', href: '/contato' },
  },
  operation: {
    eyebrow: 'Por trás de cada embarque',
    title: 'Pessoas e processos em cada etapa.',
    body: 'Da conferência à distribuição, veja como a operação é organizada por quem acompanha a carga.',
    image: '/assets/visuals-2026/11-armazenagem.webp',
    action: { label: 'Ver nossas unidades', href: '/unidades' },
  },
  planning: {
    eyebrow: 'Mais de um destino',
    title: 'Planeje corredores em uma só conversa.',
    body: 'Selecione as rotas relevantes para sua empresa e leve o contexto da operação ao time comercial.',
    image: '/assets/visuals-2026/08-motorista.webp',
    action: { label: 'Planejar minhas rotas', href: '/rotas' },
  },
  editorial: {
    eyebrow: 'Conteúdo Bomfim',
    title: 'Da leitura ao próximo movimento.',
    body: 'Use o que aprendeu para avaliar corredores e conversar sobre a operação da sua empresa.',
    image: '/assets/visuals-2026/12-triagem.webp',
    action: { label: 'Explorar rotas', href: '/rotas' },
    secondary: { label: 'Falar com comercial', href: '/contato' },
  },
}

export default function SectionBanner({ variant = 'coverage' }) {
  const banner = banners[variant]
  if (!banner) return null

  return <section className={`section-banner section-banner--${variant}`} aria-label={banner.eyebrow}>
    <img src={banner.image} alt="" aria-hidden="true" loading="lazy" />
    <div className="section-banner__shade" aria-hidden="true" />
    <div className="container-site section-banner__inner">
      {variant === 'coverage' && <div className="section-banner__states"><span className="line-accent" aria-hidden="true" /><h2 className="heading mt-4 text-2xl">Atuamos em 7 estados do Nordeste</h2><ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-[var(--subtle)]">{states.map(state => <li key={state}>{state}</li>)}</ul><p className="mt-5 text-xs text-[var(--muted)]">Cobertura por cidade e condições da rota sujeitas a confirmação.</p></div>}
      <div className="section-banner__copy"><p className="text-xs font-bold uppercase tracking-[.14em] text-white/75">{banner.eyebrow}</p><h2 className="heading mt-3 text-3xl sm:text-4xl">{banner.title}</h2><p className="mt-4 max-w-xl text-base leading-7 text-white/90">{banner.body}</p><div className="mt-6 flex flex-wrap gap-3"><Link className="section-banner__primary" to={banner.action.href}>{banner.action.label}<ArrowRight size={17} aria-hidden="true" /></Link>{banner.secondary && <Link className="section-banner__secondary" to={banner.secondary.href}>{banner.secondary.label}<ArrowRight size={17} aria-hidden="true" /></Link>}</div></div>
    </div>
  </section>
}
