import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Check, Monitor, MousePointer2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { campaignCatalog } from './catalog.js'
import ConversionPage from '../pages/Conversion.jsx'

export default function LandingShowcase() {
  const [active, setActive] = useState(campaignCatalog[0].id)
  const viewportRef = useRef(null)
  const [scale, setScale] = useState(1)
  const selected = campaignCatalog.find(item => item.id === active) || campaignCatalog[0]
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / 1440)))
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])
  return <main className="landing-showcase" aria-labelledby="landing-showcase-title">
    <header className="landing-showcase__header">
      <div><p className="eyebrow">Bomfim · campanhas</p><h1 id="landing-showcase-title" className="heading">Vitrine de landing pages</h1><p>Quatro momentos da jornada, uma estrutura clara e formulários prontos para demonstração.</p><Link className="landing-showcase__back" to="/">← Voltar ao site Bomfim</Link></div>
      <div className="landing-showcase__viewport-label"><Monitor size={17}/><span>Viewport de referência</span><strong>1440 × 900</strong></div>
    </header>
    <section className="landing-showcase__workspace" aria-label="Pré-visualização das landing pages">
      <nav className="landing-showcase__rail" aria-label="Escolher landing page">{campaignCatalog.map((campaign, index) => <button type="button" key={campaign.id} onClick={() => setActive(campaign.id)} aria-pressed={campaign.id === active} className={`landing-showcase__choice ${campaign.id === active ? 'is-active' : ''}`}><span className="landing-showcase__number">0{index + 1}</span><span className="landing-showcase__choice-copy"><strong>{campaign.label}</strong><small>{campaign.stage}</small></span>{campaign.id === active ? <Check size={17}/> : <ArrowRight size={16}/>}<span className="landing-showcase__choice-summary">{campaign.summary}</span></button>)}</nav>
      <div className="landing-showcase__stage-wrap"><div className="landing-showcase__stage-meta"><span><MousePointer2 size={15}/> Preview interativo</span><Link to={`/campanhas/${selected.id}`} target="_blank" rel="noreferrer">Abrir página em nova aba <ArrowRight size={15}/></Link></div><div className="landing-showcase__viewport" key={selected.id} ref={viewportRef} style={{ '--preview-accent': selected.color }}><div className="landing-showcase__viewport-content" style={{ transform: `scale(${scale})` }}><ConversionPage kind="contact" campaign={selected.id} preview /></div></div><div className="landing-showcase__stage-hint"><ArrowDown size={15}/> Role dentro da janela para explorar o restante da página</div></div>
    </section>
    <section className="landing-showcase__principles"><div><span>01</span><strong>Uma intenção por página</strong><small>Mensagem e próxima ação alinhadas ao momento da jornada.</small></div><div><span>02</span><strong>Imagem + contexto</strong><small>Visual editorial apoia a mensagem sem competir com ela.</small></div><div><span>03</span><strong>Formulário ao lado</strong><small>Campos visíveis no primeiro viewport desktop.</small></div></section>
  </main>
}
