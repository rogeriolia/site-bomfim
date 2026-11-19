import { ArrowRight, ClipboardList, MapPinned, PackageSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/UI.jsx'
import ContentShowcase from '../components/ContentShowcase.jsx'
import EditorialFeature from '../components/EditorialFeature.jsx'
import SolutionCard from '../components/SolutionCard.jsx'
import { HeroActions, MarketingHero } from '../components/MarketingHero.jsx'

const quickLinks = [
  { icon: ClipboardList, title: 'Enviar uma carga', detail: 'Solicitar cotação', href: '/cotacao' },
  { icon: MapPinned, title: 'Planejar minhas rotas', detail: 'Reunir origens e destinos', href: '/rotas/planejar' },
  { icon: PackageSearch, title: 'Rastrear uma carga', detail: 'Consultar código ou NF', action: 'track' },
]

const services = [
  { slug: 'carga-fracionada', name: 'Carga fracionada', intro: 'Envios compartilhados com cargas de outras empresas.', image: '/assets/visuals-2026/06-conferencia.webp' },
  { slug: 'embarques-recorrentes', name: 'Embarques recorrentes', intro: 'Destinos e frequências definidos para a reposição da sua empresa.', image: '/assets/visuals-2026/08-motorista.webp' },
  { slug: 'coleta-programada', name: 'Coleta programada', intro: 'Retirada alinhada à preparação e à expedição da carga.', image: '/assets/visuals-2026/03-hero-coleta.webp' },
  { slug: 'distribuicao-personalizada', name: 'Distribuição personalizada', intro: 'Entregas em várias cidades e transferências entre filiais.', image: '/assets/visuals-2026/14-distribuicao-urbana.webp' },
]

function DiscoveryHome() {
  return <main className="home-discovery">
    <MarketingHero image="/assets/visuals-2026/02-hero-estrutura.webp" className="home-hero">
      <div className="max-w-[680px]">
        <h1 className="heading text-[clamp(2.15rem,4.2vw,3.9rem)]">Carga fracionada para empresas do Nordeste.</h1>
        <p className="mt-5 max-w-[570px] text-base leading-7 text-white/90 sm:text-lg">Desde 1991, fazemos coleta, transporte e distribuição para empresas da região.</p>
        <HeroActions className="mt-7"><Button href="/solucoes" size="lg">Ver soluções <ArrowRight size={18} /></Button><Button href="/comercial" variant="on-dark" size="lg">Falar com comercial <ArrowRight size={18} /></Button></HeroActions>
      </div>
    </MarketingHero>

    <section aria-label="Acessos rápidos" className="home-entry-actions container-site"><div className="grid md:grid-cols-3">{quickLinks.map(({icon:Icon,...item}) => { const content = <><Icon size={25} aria-hidden="true" className="shrink-0 text-[var(--brand)]" /><span className="min-w-0 flex-1 text-left"><strong className="block text-sm font-bold text-[var(--ink)] group-hover:text-[var(--brand)]">{item.title}</strong><span className="mt-1 block text-xs text-[var(--muted)]">{item.detail}</span></span><ArrowRight size={17} aria-hidden="true" className="shrink-0 text-[var(--brand)]" /></>; const className = 'group flex min-h-24 w-full items-center gap-4 border-b border-[var(--line)] px-5 py-4 text-left last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0'; return item.action ? <button key={item.title} type="button" onClick={() => window.dispatchEvent(new Event('bomfim:track'))} className={className}>{content}</button> : <Link key={item.title} to={item.href} className={className}>{content}</Link> })}</div></section>

    <section className="home-solutions" aria-labelledby="home-solutions-title">
      <div className="container-site">
        <div className="home-solutions__header">
          <div>
            <h2 id="home-solutions-title" className="heading">Rotas e serviços no Nordeste</h2>
            <p className="home-solutions__intro">Carga fracionada, embarques recorrentes, coleta programada e distribuição para várias cidades.</p>
          </div>
          <Link to="/solucoes" className="home-solutions__all">Todas as soluções <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="home-solutions__cards">
          {services.map(service => <SolutionCard key={service.slug} service={service} image={service.image} showAction={false} />)}
        </div>
      </div>
    </section>

    <section className="home-proof" aria-labelledby="home-proof-title"><div className="container-site"><div className="home-proof__intro"><h2 id="home-proof-title" className="heading">Números da operação em 2025</h2><p>Dados de janeiro a dezembro de 2025. Os volumes mensais estão indicados em cada item.</p></div><div className="home-proof__stats"><div><strong>21 mil+</strong><span>entregas realizadas por mês</span></div><div><strong>5.400 t</strong><span>transportadas por mês</span></div><div><strong>400+</strong><span>colaboradores diretos</span></div><div><strong>8</strong><span>unidades no Nordeste</span></div></div></div></section>

    <EditorialFeature id="home-structure-title" title="Da coleta à entrega, cada etapa conta." description="Conferência, gestão de risco, comunicação e tratamento de exceções acompanham o embarque. Conheça as equipes, unidades, processos e tecnologias da operação." image="/assets/visuals-2026/11-armazenagem.webp" imageAlt="Imagem de equipe trabalhando em um armazém, com cargas e empilhadeira" href="/estrutura" action="Conhecer a estrutura" reverse />

    <ContentShowcase homeCopy />

  </main>
}

export default function Home() {
  return <DiscoveryHome />
}
