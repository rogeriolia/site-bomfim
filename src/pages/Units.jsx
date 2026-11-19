import SectionBanner from '../components/SectionBanner.jsx'
import { MarketingHero } from '../components/MarketingHero.jsx'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'

import units from '../data/units.js'

function UnitRow({ unit, index }) {
  return <article className={`unit-row${index % 2 ? ' unit-row--reverse' : ''}`}>
    <div className="unit-row__photo-wrap">
      <img className="unit-row__photo" src={`/assets/units/${unit.image}`} alt={`Ilustração conceitual de uma unidade logística em ${unit.name}`} loading="lazy" />
      
    </div>
    <div className="unit-row__details">
      <p className="eyebrow">{unit.state}</p>
      <h2 className="heading">{unit.name}</h2>
      <p className="unit-row__address"><MapPin size={18} aria-hidden="true" />{unit.address}</p>
      <a className="unit-row__contact" href={`tel:${unit.phone.replace(/\D/g, '')}`}><Phone size={17} aria-hidden="true" />{unit.phone}</a>
    </div>
    <aside className="unit-row__manager" aria-label={`Contato da gerência de ${unit.name}`}>
      <span className="unit-row__manager-icon"><Mail size={19} aria-hidden="true" /></span>
      <div><p className="unit-row__manager-label">Gerência da unidade</p><p className="unit-row__pending">Consulte a equipe pelo telefone da unidade.</p></div>
    </aside>
  </article>
}

export default function UnitsPage() {
  return <main className="units-page">
    <MarketingHero image="/assets/visuals-2026/11-armazenagem.webp" size="compact" className="information-hero">
      <div className="max-w-[650px]">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-white/85">Onde estamos</p>
        <h1 className="heading mt-4 text-4xl text-white sm:text-5xl">Unidades Bomfim no Nordeste.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-white/90">Consulte os endereços e telefones das equipes que atendem cada região.</p>
        <a href="#lista-unidades" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[var(--ink)]">Explorar unidades <ArrowRight size={17} aria-hidden="true" /></a>
      </div>
    </MarketingHero>
    <section id="lista-unidades" className="container-site units-list">
      <div className="units-list__intro"><div><p className="eyebrow">8 pontos de atendimento</p><h2 className="heading">Unidades Bomfim</h2></div></div>
      <div className="units-list__rows">{units.map((unit, index) => <UnitRow key={unit.name} unit={unit} index={index} />)}</div>

    </section>
    <SectionBanner variant="connection" />
  </main>
}
