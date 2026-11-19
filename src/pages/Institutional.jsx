import EditorialText from '../components/EditorialText.jsx'
import '../styles/editorial-reading.css'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MarketingHero } from '../components/MarketingHero.jsx'
import { Button } from '../components/UI.jsx'
import copy from '../data/institutionalCopy.json'

export default function InstitutionalPage({ pageKey }) {
  const page = copy[pageKey]
  const technology = pageKey === 'tecnologia'
  return <main className="institutional-reading">
    <MarketingHero image={page.image} size="compact" className="information-hero">
      <div className="institutional-reading__hero-copy">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-white/85">{page.eyebrow}</p>
        <h1 className="heading mt-4 text-4xl text-white sm:text-5xl">{page.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90"><EditorialText>{page.intro}</EditorialText></p>
        <div className="mt-7 flex flex-wrap gap-3"><Button href={technology ? '/area-do-cliente' : '/contato'}>{technology ? 'Acessar o portal do cliente' : 'Falar com a Bomfim'} <ArrowRight size={17} aria-hidden="true" /></Button><Button href={technology ? '/estrutura' : '/unidades'} variant="on-dark">{technology ? 'Conhecer a estrutura' : 'Encontrar uma unidade'}</Button></div>
      </div>
    </MarketingHero>
    <div className="container-site section-space">
      <div className="institutional-reading__layout"><nav className="institutional-reading__index" aria-label="Nesta página"><strong>Nesta página</strong>{page.sections.map((section, index) => <a key={section.title} href={`#institucional-${index}`}>{section.title}</a>)}</nav><div className="institutional-reading__sections">{page.sections.map((section, index) => <section id={`institucional-${index}`} key={section.title}>
        <h2 className="heading text-2xl sm:text-3xl">{section.title}</h2>
        {section.paragraphs.map(paragraph => <p key={paragraph} className="mt-4 leading-7 text-[var(--muted)]"><EditorialText>{paragraph}</EditorialText></p>)}
      </section>)}</div></div>
      <nav aria-label="Conheça a Bomfim" className="mt-12 flex flex-wrap gap-6 border-t border-[var(--line)] pt-8">{[['quem-somos','Sobre a Bomfim'],['estrutura','Nossa estrutura'],['tecnologia','Tecnologia'],['solucoes','Soluções']].filter(([key]) => key !== pageKey).map(([key,label]) => <Link key={key} to={`/${key}`} className="inline-flex min-h-11 items-center gap-2 font-bold text-[var(--brand)]">{label}<ArrowRight size={17} aria-hidden="true" /></Link>)}</nav>
    </div>
  </main>
}
