import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function MenuLink({ child, onNavigate }) {
  return <Link to={child.href} onClick={onNavigate} className="nav-panel__link"><span><strong>{child.label}</strong><small>{child.description}</small></span><ArrowRight size={16} aria-hidden="true" /></Link>
}

export default function MegaMenu({ item, onNavigate }) {
  return <div className={`nav-panel ${item.groups ? 'nav-panel--solutions' : ''} ${item.label === 'Comercial' ? 'nav-panel--commercial' : ''} ${item.label === 'Cobertura' ? 'nav-panel--coverage' : ''}`} role="region" aria-label={`Menu ${item.label}`}>
    {item.groups ? <div className="nav-panel__groups">{item.groups.map(group => <section key={group.label}><h2>{group.label}</h2><ul>{group.children.map(child => <li key={child.href}><MenuLink child={child} onNavigate={onNavigate} /></li>)}</ul></section>)}</div> : <ul className="nav-panel__items">{item.children.map(child => <li key={child.href}><MenuLink child={child} onNavigate={onNavigate} /></li>)}</ul>}
    {item.action && <div className="nav-panel__footer"><Link to={item.action.href} onClick={onNavigate}>{item.action.label}<ArrowRight size={16} aria-hidden="true" /></Link></div>}
  </div>
}
