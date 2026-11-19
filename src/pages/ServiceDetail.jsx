import EditorialText from '../components/EditorialText.jsx'
import '../styles/editorial-reading.css'
import { ArrowRight, CircleHelp } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/UI.jsx'
import { serviceBySlug } from '../data/services.js'
import CargoRestrictionsFaq from '../components/CargoRestrictionsFaq.jsx'

function ServiceScenes({ service }) {
  return <section className="service-detail__scenes" aria-labelledby="service-scenes-title">
    <div className="service-detail__scenes-heading">
      <p className="eyebrow">Na operação</p>
      <h2 id="service-scenes-title" className="heading">{service.scenesHeading}</h2>
    </div>
    <figure className="service-detail__scenes-figure">
      <img src={service.scenesImage} alt={service.scenesAlt} loading="lazy" />
      <figcaption>{service.sceneCaptions.map((caption) => <span key={caption}>{caption}</span>)}</figcaption>
    </figure>
  </section>
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = serviceBySlug[slug]
  if (!service) return <main className="container-site section-space"><h1 className="heading text-4xl">Solução não encontrada</h1><Link to="/solucoes" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-[var(--brand)]">Ver soluções <ArrowRight size={17}/></Link></main>
  const relatedMap = {
    'carga-fracionada': ['coleta-programada', 'paletizacao', 'embarques-recorrentes'],
    'embarques-recorrentes': ['carga-fracionada', 'distribuicao-personalizada', 'agendamentos'],
    'coleta-programada': ['carga-fracionada', 'agendamentos', 'distribuicao-personalizada'],
    'distribuicao-personalizada': ['embarques-recorrentes', 'agendamentos', 'last-mile'],
    'armazenagem': ['cross-docking', 'paletizacao', 'distribuicao-personalizada'],
    'cross-docking': ['armazenagem', 'paletizacao', 'distribuicao-personalizada'],
    'paletizacao': ['carga-fracionada', 'armazenagem', 'cross-docking'],
    'agendamentos': ['coleta-programada', 'distribuicao-personalizada', 'last-mile'],
    'e-commerce': ['last-mile', 'distribuicao-personalizada', 'agendamentos'],
    'last-mile': ['e-commerce', 'agendamentos', 'distribuicao-personalizada'],
  }
  const related = (relatedMap[slug] || []).map(itemSlug => serviceBySlug[itemSlug]).filter(Boolean)

  return <main className="service-detail">
    <section className="service-detail__hero" style={{ '--service-hero-image': `url("${service.heroImage}")` }}><div className="container-site service-detail__hero-grid"><div className="service-detail__hero-copy"><h1 className="heading">{service.title}</h1><p className="service-detail__lead"><EditorialText>{service.intro}</EditorialText></p><div className="service-detail__actions"><Button href={service.primary.href}>{service.primary.label} <ArrowRight size={17}/></Button><Button href={service.secondary.href} variant="on-dark">{service.secondary.label}</Button></div></div></div></section>

    <div className="container-site service-detail__body-grid">
      <div className="service-detail__body-content">
        <section id="service-overview" className="service-detail__audience"><p className="eyebrow">Para quem faz sentido</p><h2 className="heading">{service.editorial?.audienceTitle || 'Uma solução ligada ao jeito de embarcar.'}</h2><p><EditorialText>{service.audience}</EditorialText></p></section>
        <ServiceScenes service={service} />
        <section id="service-process" className="service-detail__process"><div className="service-detail__intro"><p className="eyebrow">Como começamos</p><h2 className="heading">{service.editorial?.processTitle || 'O que dá forma à operação.'}</h2><p>{service.editorial?.processDescription || 'Estas são etapas de avaliação, não uma promessa de prazo ou disponibilidade. A proposta concreta depende dos dados de cada embarque.'}</p></div><ol className="service-detail__steps">{service.steps.map(([title, body], index) => <li key={title}><span className="service-detail__step-number">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p><EditorialText>{body}</EditorialText></p></li>)}</ol></section>
        <section className="service-detail__commercial" aria-labelledby="service-commercial-title">
          <div className="service-detail__commercial-image"><img src="/assets/visuals-2026/04-hero-atendimento.webp" alt="Profissional uniformizada da Bomfim em atendimento, com a marca no uniforme e no caminhão ao fundo" loading="lazy" /></div>
          <div className="service-detail__commercial-copy"><p className="eyebrow">Próximo passo</p><h2 id="service-commercial-title" className="heading">Vamos entender o que sua operação precisa.</h2><p>Para um embarque pontual, comece pela cotação com os dados da carga e do trajeto. Se sua empresa embarca todos os meses, fale com o time comercial: condições especiais podem ser preparadas de acordo com a sua necessidade, frequência e perfil de operação.</p><div className="service-detail__commercial-actions"><Button href="/cotacao">Iniciar cotação <ArrowRight size={17} /></Button><Button href="/comercial" variant="outline">Falar com comercial <ArrowRight size={17} /></Button></div></div>
        </section>
        <section id="service-faq" className="service-detail__faq"><div className="service-detail__intro"><p className="eyebrow">Respostas rápidas</p><h2 className="heading">Dúvidas comuns</h2></div><div className="service-detail__faq-list">{service.questions.filter(([question]) => question !== 'Posso enviar qualquer mercadoria?').map(([question, answer]) => <details key={question}><summary><CircleHelp size={19} aria-hidden="true"/>{question}</summary><p><EditorialText>{answer}</EditorialText></p></details>)}<CargoRestrictionsFaq /></div></section>
      </div>
    </div>

    <section className="service-detail__related" aria-labelledby="related-solutions-title"><div className="container-site"><div className="service-detail__related-heading"><p className="eyebrow">Continue explorando</p><h2 id="related-solutions-title" className="heading">Outras soluções Bomfim</h2></div><div className="service-detail__related-grid">{related.map(item => <Link className="service-related-card" key={item.slug} to={`/solucoes/${item.slug}`}><img src={item.illustration} alt={item.visualAlt} loading="lazy"/><div className="service-related-card__body"><h3>{item.name}</h3><p>{item.audience}</p><span>Conhecer solução <ArrowRight size={17} aria-hidden="true"/></span></div></Link>)}</div></div></section>
  </main>
}
