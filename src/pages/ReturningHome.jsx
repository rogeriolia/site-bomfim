import { useState } from 'react'
import { ArrowRight, CalendarDays, FileText, Map, MapPin, PackageSearch, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/UI.jsx'

const clientPortal = 'https://cliente.bomfimcargas.com.br'

const quickActions = [
  { icon: UserRound, title: 'Portal do cliente', description: 'Comprovantes, faturas e consultas', href: clientPortal, external: true },
  { icon: CalendarDays, title: 'Agendar coleta', description: 'Organize a retirada da carga', href: '/coleta' },
  { icon: FileText, title: 'Solicitar cotação', description: 'Prepare um novo embarque', href: '/cotacao' },
  { icon: Map, title: 'Planejar rotas', description: 'Consulte cidades e corredores', href: '/rotas/planejar' },
  { icon: MapPin, title: 'Encontrar unidade', description: 'Endereços e telefones', href: '/unidades' },
]

function QuickAction({ icon: Icon, title, description, href, external }) {
  const content = <><span className="returning-action__icon"><Icon size={20} aria-hidden="true" /></span><span className="returning-action__copy"><strong>{title}</strong><small>{description}</small></span><ArrowRight className="returning-action__arrow" size={17} aria-hidden="true" /></>
  const className = 'returning-action'
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
    : <Link to={href} className={className}>{content}</Link>
}

function TrackingCard() {
  const [reference, setReference] = useState('')
  const continueToPortal = event => {
    event.preventDefault()
    window.open(`${clientPortal}/rastreamento?q=${encodeURIComponent(reference.trim())}`, '_blank', 'noopener,noreferrer')
  }
  return <div className="returning-tracking-card rounded-xl border border-[var(--line)] bg-white p-5 shadow-lg shadow-black/10 sm:p-7">
    <div className="flex items-center gap-3"><PackageSearch size={28} className="shrink-0 text-[var(--brand)]" aria-hidden="true" /><h2 className="heading text-xl sm:text-2xl">Acompanhe sua carga</h2></div>
    <form onSubmit={continueToPortal} className="mt-5">
      <label htmlFor="tracking-reference-home" className="field-label">Código de rastreio ou documento</label>
      <input id="tracking-reference-home" className="field" type="text" value={reference} onChange={event => setReference(event.target.value)} placeholder="Digite o código ou documento" autoComplete="off" required />
      <Button type="submit" className="mt-3 w-full">Continuar no portal <ArrowRight size={17} aria-hidden="true" /></Button>
      <p className="mt-2 text-xs leading-5 text-[var(--muted)]">A consulta é realizada no portal oficial da Bomfim.</p>
    </form>
    <div className="returning-tracking-card__footer"><a href="tel:08003388700">Precisa de ajuda? 0800 338 8700</a></div>
  </div>
}

export default function ReturningHome() {
  return <main className="returning-home">
    <section className="returning-home-hero">
      <img className="returning-home-hero__image" src="/assets/visuals-2026/16-hero-home-recorrente.webp" alt="Profissional conferindo uma carga em um centro de distribuição" fetchPriority="high" />
      <div className="returning-home-hero__shade" aria-hidden="true" />
      <div className="container-site returning-home-hero__inner">
        <div className="returning-home-hero__copy"><p className="eyebrow">Bomfim no dia a dia</p><h1 className="heading">Rastreie cargas e organize embarques.</h1><p>Consulte uma entrega ou escolha o próximo serviço da sua operação pelos atalhos desta página.</p><a className="returning-home-hero__portal" href="#tarefas-frequentes">Ver serviços para clientes <ArrowRight size={17} aria-hidden="true" /></a></div>
        <TrackingCard />
      </div>
    </section>

    <section id="tarefas-frequentes" className="returning-actions-section" aria-labelledby="returning-actions-title"><div className="container-site"><div className="returning-actions-heading"><div><p className="eyebrow">Acesso rápido</p><h2 id="returning-actions-title" className="heading">O que você precisa fazer?</h2></div><p>Atalhos para as tarefas mais comuns de quem já embarca com a Bomfim.</p></div><nav className="returning-actions-grid" aria-label="Tarefas frequentes">{quickActions.map(action => <QuickAction key={action.title} {...action} />)}</nav></div></section>
  </main>
}
