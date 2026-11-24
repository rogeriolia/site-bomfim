import HeroImage from '../components/HeroImage.jsx'
import { getRouteImage } from '../data/pageMetadata.js'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CoverageModal from '../components/CoverageModal.jsx'
import { ArrowLeft, ArrowRight, CheckCircle2, MapPinned } from 'lucide-react'
import routes from '../data/routes.json'
import { Button, Dialog } from '../components/UI.jsx'
import RouteDetailContent from '../components/RouteDetailContent.jsx'
import { cargoProfile } from '../data/cargoProfile.js'
import StateFlag from '../components/StateFlag.jsx'
import CepRoutePlanner from '../components/CepRoutePlanner.jsx'

export function RoutesPage() {
  const [restrictionsOpen, setRestrictionsOpen] = useState(false)
  return <main>
    <section className="route-hero">
      <picture aria-hidden="true"><source media="(max-width: 767px)" srcSet="/assets/routes-hero-bomfim-v2-mobile.webp" /><HeroImage src="/assets/routes-hero-bomfim-v2.webp" alt="" fetchPriority="high" /></picture>
      <div className="container-site route-hero__content"><div className="route-hero__copy"><h1 className="heading mt-4 text-4xl text-white sm:text-5xl">Distribuição entre cidades.<br /> Estoque onde precisa estar.</h1><p className="mt-5 max-w-xl text-base leading-7 text-white/90">Conheça os principais corredores da Bomfim e monte uma rota para a realidade da sua empresa.</p><div className="route-hero__actions"><Link to="/rotas/planejar" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[var(--ink)] hover:bg-[var(--soft)]">Planejar minha rota <ArrowRight size={16} aria-hidden="true" /></Link></div></div></div>
    </section>
    <div className="container-site py-4"><CoverageModal triggerLabel="Consultar cidades e CEPs atendidos" /></div>
    <section className="route-overview container-site" aria-labelledby="route-overview-title"><div className="route-overview__intro"><h2 id="route-overview-title" className="heading">Uma base para decidir o próximo destino.</h2><p>A Bomfim organiza rotas, CEPs, unidades e prazos médios para transformar uma necessidade de distribuição em uma conversa objetiva.</p></div><div className="route-overview__stats"><div><strong>14.312</strong><span>combinações de origem e destino na base</span></div><div><strong>7 estados</strong><span>na cobertura padrão do Nordeste</span></div><div><strong>5.145 km</strong><span>somados nos corredores principais exibidos</span></div></div></section>
    <section className="route-corridors container-site" aria-labelledby="route-corridors-title"><div className="route-corridors__heading"><div><h2 id="route-corridors-title" className="heading">Alguns caminhos que já fazem parte da operação.</h2></div><Button href="/rotas/planejar" className="route-corridors__cta">Planejar rota com a Bomfim <ArrowRight size={17}/></Button></div><div className="route-corridors__list">{routes.slice(0, 6).map(route => <Link key={route.id} to={`/rotas/${route.id}`}><span className="route-corridors__trip"><span><StateFlag uf={route.originUf}/>{route.origin}</span><b aria-label="para">→</b><span><StateFlag uf={route.destinationUf}/>{route.destination}</span></span><small>{route.distance} · {route.leadTime}</small><ArrowRight size={17}/></Link>)}</div></section>
    <section className="route-coverage-summary"><div className="container-site route-coverage-summary__inner"><div><p className="eyebrow">Cobertura</p><h2 className="heading">O destino aparece. A operação confirma.</h2><p>Use o planejador para buscar cidades e CEPs. Maranhão e Piauí podem ser avaliados em operações de clientes antigos.</p></div><ul><li><CheckCircle2 size={18}/>Rotas principais para começar</li><li><CheckCircle2 size={18}/>Busca por CEP para sua operação</li><li><CheckCircle2 size={18}/>Distância e prazo médio como referência</li></ul></div></section>
    <div className="container-site py-4"><button type="button" onClick={() => setRestrictionsOpen(true)} className="min-h-11 text-sm text-[var(--subtle)] underline underline-offset-4">Consultar restrições de transporte</button></div>
    <Dialog open={restrictionsOpen} onClose={() => setRestrictionsOpen(false)} titleId="route-restrictions-title"><h2 id="route-restrictions-title" className="heading pr-10 text-2xl">Restrições de transporte</h2><p className="mt-4 text-sm leading-6 text-[var(--subtle)]">Algumas mercadorias não são transportadas. Outras exigem condições específicas.</p><div className="mt-5 space-y-3 text-sm leading-6"><p><strong>Bebidas:</strong> transporte apenas com DDR.</p><p><strong>Peças automotivas:</strong> exigem carta de isenção. Lataria, faróis e para-brisas têm restrições de transporte.</p></div><ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6">{cargoProfile.restrictedItems.map(item => <li key={item}>{item}</li>)}</ul></Dialog>
  </main>
}

export function RoutePlanningPage() {
  return <CepRoutePlanner />
}

export function CorridorPage() {
  const { id } = useParams()
  const route = routes.find(item => item.id === id)
  if (!route) return <main className="container-site section-space"><h1 className="heading text-4xl">Corredor não encontrado</h1><Button href="/rotas" className="mt-6">Ver rotas</Button></main>
  return <main className="container-site section-space route-corridor-page">
    <Link to={`/rotas?origem=${encodeURIComponent(route.origin)}`} className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--brand)]"><ArrowLeft size={17} aria-hidden="true" />Voltar às saídas de {route.origin}</Link>
    <p className="eyebrow">Distribuição entre cidades</p><h1 className="heading mt-3 text-4xl sm:text-5xl">{route.origin} → {route.destination}</h1><p className="mt-5 max-w-2xl text-lg leading-7 text-[var(--muted)]">Confira os detalhes do trecho e planeje a distribuição ou a transferência de estoques.</p>
    <img src={getRouteImage(route)} alt={`Representação visual de uma unidade logística em ${route.destination}`} className="mt-8 aspect-[3] w-full rounded-xl object-cover max-sm:aspect-[16/7]" />
    <RouteDetailContent route={route} />
    <div className="mt-8 flex flex-wrap items-center gap-5"><Button href={`/rotas?origem=${encodeURIComponent(route.origin)}&selecionadas=${route.id}#planejador`}>Planejar com esta rota <ArrowRight size={18} aria-hidden="true" /></Button><Link to={`/contato?rotas=${route.id}`} className="inline-flex min-h-11 items-center text-sm font-bold text-[var(--brand)] underline">Conversar sobre este trecho</Link></div>
  </main>
}
