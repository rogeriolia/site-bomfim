import { Link } from 'react-router-dom'
import { ArrowUp, Instagram, Linkedin, Phone } from 'lucide-react'
import { footerGroups } from '../data/navigation.js'

const whatsappUrl = 'https://wa.me/558003388700'
const socialLinks = [
  { label: 'Instagram da Bomfim Cargas', href: 'https://instagram.com/bomfimcargasoficial', Icon: Instagram },
  { label: 'LinkedIn da Bomfim Cargas', href: 'https://www.linkedin.com/company/bomfim-cargas-oficial/', Icon: Linkedin },
]

function MessageCircle({ size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .12 5.35.12 11.93c0 2.1.55 4.15 1.59 5.96L0 24l6.26-1.64a11.95 11.95 0 0 0 5.79 1.48h.01c6.57 0 11.92-5.35 11.93-11.93a11.86 11.86 0 0 0-3.47-8.43ZM12.06 21.82a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.89 9.89 0 0 1-1.52-5.28c0-5.46 4.44-9.9 9.9-9.9a9.83 9.83 0 0 1 7 2.9 9.84 9.84 0 0 1 2.9 7c0 5.45-4.45 9.89-9.9 9.89Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.66-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.48 1.7.62.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.35Z" /></svg>
}

export default function SiteFooter({ compact = false }) {
  const preferences = () => window.dispatchEvent(new Event('bomfim:cookie-preferences'))
  if (compact) return <footer className="conversion-footer"><div className="container-site conversion-footer__inner"><Link to="/" aria-label="Bomfim Cargas — início"><img src="/assets/brand/bomfim-cargas.webp" alt="Bomfim Cargas" /></Link><span>Bomfim Cargas e Encomendas LTDA · CNPJ 32.808.669/0001-09</span><nav aria-label="Links legais e contato"><a href="tel:08003388700"><Phone size={14} aria-hidden="true" />0800 338 8700</a><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp 24 horas — 0800 338 8700"><MessageCircle size={15} aria-hidden="true" />WhatsApp 24h</a><Link to="/privacidade">Privacidade</Link><Link to="/canal-de-denuncias">Canal de denúncias</Link></nav><small>© {new Date().getFullYear()} Bomfim Cargas</small></div></footer>
  return <footer className="site-footer">
    <div className="container-site">
      <div className="site-footer__layout">
        <div className="site-footer__brand">
          <Link to="/" aria-label="Bomfim Cargas — início" className="site-footer__logo"><img src="/assets/brand/bomfim-cargas.webp" alt="Bomfim Cargas" className="logo-white" width="160" height="48" /></Link>
          <p>Transporte e distribuição de cargas fracionadas no Nordeste. Desde 1991, conectando empresas, clientes e destinos.</p>
          <div className="site-footer__contacts">
            <a href="tel:08003388700"><Phone size={19} aria-hidden="true" /><span><small>Ligações · seg–sex, 7h30–17h30</small><strong>0800 338 8700</strong></span></a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp 24 horas — 0800 338 8700"><MessageCircle size={20} aria-hidden="true" /><span><small>WhatsApp · 24 horas</small><strong>0800 338 8700</strong></span></a>
          </div>
          <div className="site-footer__social" role="group" aria-label="Redes sociais da Bomfim">{socialLinks.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}><Icon size={20} aria-hidden="true" /></a>)}</div>
        </div>
        <nav className="site-footer__navigation" aria-label="Navegação do rodapé">{footerGroups.map(group => <div key={group.title}><h2>{group.title}</h2><ul>{group.links.map(item => <li key={item.label}><Link to={item.href}>{item.label}</Link></li>)}</ul></div>)}</nav>
      </div>
      <div className="site-footer__legal">
        <span className="site-footer__company">Bomfim Cargas e Encomendas LTDA · CNPJ 32.808.669/0001-09</span>
        <nav aria-label="Informações legais" className="site-footer__legal-links"><Link to="/privacidade">Política de Privacidade</Link><button type="button" onClick={preferences}>Preferências de cookies</button><Link to="/canal-de-denuncias">Canal de denúncias</Link></nav>
        <span className="site-footer__copyright">© {new Date().getFullYear()} Bomfim Cargas</span>
        <button type="button" className="site-footer__top" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Voltar ao topo <ArrowUp size={16} aria-hidden="true" /></button>
      </div>
    </div>
  </footer>
}
