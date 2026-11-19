import HeroImage from './HeroImage.jsx'
import { ArrowDown, ArrowRight, Building2, MapPinned, PackageCheck, Phone, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import CoverageModal from './CoverageModal.jsx'

const iconMap = { routes: MapPinned, operation: Truck, people: Building2, cargo: PackageCheck }

export default function ConversionLayout({ eyebrow, title, body, image, points, children, formTitle, formNote, className = '', onStartForm, primaryAction = 'Começar solicitação' }) {
  return <main className={`conversion-page ${className}`}>
    <section className="conversion-hero" aria-labelledby="conversion-title">
      <HeroImage className="conversion-hero__image" src={image} alt="" aria-hidden="true" />
      <div className="conversion-hero__shade" aria-hidden="true" />
      <div className="container-site conversion-hero__grid">
        <div className="conversion-hero__copy">
          <h1 id="conversion-title" className="heading">{title}</h1>
          <p className="conversion-hero__body">{body}</p>
          {onStartForm && <button type="button" className="conversion-hero__cta" onClick={onStartForm}>{primaryAction}<ArrowDown size={18} aria-hidden="true" /></button>}
          <ul className="conversion-hero__points">{points.slice(0, 2).map(({ icon, title: pointTitle, text }) => { const Icon = iconMap[icon] || Truck; return <li key={pointTitle}><span className="conversion-hero__icon"><Icon size={20} aria-hidden="true" /></span><span><strong>{pointTitle}</strong><small>{text}</small></span></li> })}</ul>
          {!className.includes('dedicated') && <div className="conversion-hero__assurance"><ShieldCheck size={18} aria-hidden="true" /><span>Conte o básico. A equipe ajuda a definir os próximos passos.</span></div>}
          {className.includes('dedicated') && !className.includes('preview') && <div className="conversion-hero__coverage-links"><CoverageModal triggerLabel="Consultar cobertura" /><Link to="/unidades">Ver unidades <ArrowRight size={15} aria-hidden="true" /></Link></div>}
        </div>
        <div className="conversion-hero__form-wrap" id="formulario"><div className="conversion-hero__form-heading"><h2>{formTitle}</h2><p>{formNote}</p></div>{children}</div>
      </div>
    </section>
    {!className.includes('preview') && !className.includes('dedicated') && <section className="conversion-followup"><div className="container-site conversion-followup__inner"><div><p className="eyebrow">Outros caminhos</p><h2 className="heading">Prefere explorar antes de conversar?</h2></div><div className="conversion-followup__links"><Link to="/rotas">Ver rotas <ArrowRight size={17}/></Link><Link to="/solucoes">Conhecer soluções <ArrowRight size={17}/></Link><a href="tel:08003388700"><Phone size={17}/> 0800 338 8700</a></div></div></section>}
  </main>
}
