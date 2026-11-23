import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, UserRound, X, PackageSearch } from 'lucide-react'
import { navigation } from '../data/navigation.js'
import { Button } from './UI.jsx'
import MegaMenu from './MegaMenu.jsx'
import '../styles/navigation-panel.css'

export default function SiteHeader({ mode = 'site' }) {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef(null)
  const mobileToggleRef = useRef(null)
  const mobileCloseRef = useRef(null)
  const mobileDrawerRef = useRef(null)
  const menuTriggerRefs = useRef({})
  const { pathname } = useLocation()
  const links = navigation
  const selected = links.find(item => item.label === openMenu)

  function closeMobileMenu({ restoreFocus = false } = {}) {
    setMobileOpen(false)
    if (restoreFocus) mobileToggleRef.current?.focus()
  }

  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') {
        if (openMenu) menuTriggerRefs.current[openMenu]?.focus()
        setOpenMenu(null)
        if (mobileOpen) closeMobileMenu({ restoreFocus: true })
      }
    }
    function handlePointer(event) {
      if (!headerRef.current?.contains(event.target)) setOpenMenu(null)
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('pointerdown', handlePointer)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('pointerdown', handlePointer)
    }
  }, [openMenu, mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    mobileCloseRef.current?.focus()

    function trapFocus(event) {
      if (event.key !== 'Tab') return
      const focusable = [...mobileDrawerRef.current.querySelectorAll('a[href], button:not([disabled]), summary')].filter(element => element.getClientRects().length)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    function closeOnDesktop() {
      if (window.matchMedia('(min-width: 1280px)').matches) closeMobileMenu()
    }

    document.addEventListener('keydown', trapFocus)
    window.addEventListener('resize', closeOnDesktop)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', trapFocus)
      window.removeEventListener('resize', closeOnDesktop)
    }
  }, [mobileOpen])

  return (
    <header ref={headerRef} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null) }} className={`site-header fixed inset-x-0 top-0 z-30 w-full text-white ${mode === 'content' || mode === 'conversion' ? 'site-header--content bg-[var(--dark)]' : 'bg-[var(--brand)]'}`}>
      <div className="container-site flex h-[76px] items-center justify-between gap-4">
        {mode === 'conversion' ? <span className="shrink-0" aria-label="Bomfim Cargas"><img className="site-header__brand-logo logo-white h-[29px] w-auto sm:h-8" src="/assets/brand/bomfim-cargas.webp" alt="Bomfim Cargas" /></span> : <Link to="/" aria-label="Bomfim Cargas — início" className="shrink-0"><img className="site-header__brand-logo logo-white h-[29px] w-auto sm:h-8" src="/assets/brand/bomfim-cargas.webp" alt="Bomfim Cargas" /></Link>}
        {mode !== 'conversion' && <nav aria-label="Navegação principal" className="hidden items-center gap-4 xl:flex">
          {links.map(item => item.groups || item.children?.length ? (
            <button key={item.label} ref={element => { menuTriggerRefs.current[item.label] = element }} type="button" aria-expanded={openMenu === item.label} aria-controls="bomfim-mega-menu" onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); setOpenMenu(item.label); requestAnimationFrame(() => headerRef.current?.querySelector('#bomfim-mega-menu a')?.focus()) } }} onClick={() => setOpenMenu(current => current === item.label ? null : item.label)} className={`site-header__trigger ${openMenu === item.label || pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'site-header__trigger--active' : ''}`}>
              {item.label}<ChevronDown size={15} aria-hidden="true" />
            </button>
          ) : (
            <Link key={item.label} to={item.href} onMouseEnter={() => setOpenMenu(null)} className={`site-header__trigger ${pathname === item.href || (item.href === '/conteudos' && pathname.startsWith('/conteudos/')) ? 'site-header__trigger--active' : ''}`}>{item.label}</Link>
          ))}
        </nav>}
        {mode === 'conversion' && <span className="conversion-header__secure">Atendimento para empresas</span>}
        {mode !== 'conversion' && <div className="hidden items-center gap-2 whitespace-nowrap xl:flex">
          {mode === 'returning' ? <>
            <button type="button" onClick={() => document.getElementById('tracking-reference-home')?.focus()} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[var(--brand)] hover:bg-white/90"><PackageSearch size={17} aria-hidden="true" />Rastrear carga</button>
            <a href="https://cliente.bomfimcargas.com.br" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white px-4 text-sm font-normal hover:bg-white/10"><UserRound size={17} aria-hidden="true" />Área do Cliente</a>
            <Link to="/cotacao" className="ml-2 inline-flex min-h-11 items-center gap-2 text-sm font-normal hover:underline">Cotação comercial <span aria-hidden="true">→</span></Link>
          </> : <>
            <Button href="/cotacao" variant="white" size="sm" className="!px-3 !text-xs">Fazer uma cotação</Button>
            <Button href="/comercial" variant="on-dark" size="sm" className="!px-3 !text-xs">Falar com comercial</Button>
            {(mode === 'site' || mode === 'content') && <><button type="button" onClick={() => window.dispatchEvent(new Event('bomfim:track'))} className="ml-2 flex min-h-11 items-center gap-1.5 text-sm font-normal hover:underline"><PackageSearch size={17} aria-hidden="true" />Rastrear</button><a href="https://cliente.bomfimcargas.com.br" target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-1.5 text-sm font-normal hover:underline"><UserRound size={17} aria-hidden="true" />Área do Cliente</a></>}
          </>}
        </div>}
        {mode !== 'conversion' && <button ref={mobileToggleRef} className="grid h-11 w-11 place-items-center xl:hidden" type="button" aria-label="Abrir menu" aria-expanded={mobileOpen} aria-controls="bomfim-mobile-menu" onClick={() => setMobileOpen(true)}><Menu /></button>}
      </div>

      {selected && mode !== 'conversion' && <>
        <button type="button" tabIndex={-1} className="site-header__scrim" aria-label="Fechar menu de navegação" onClick={() => setOpenMenu(null)} />
        <div id="bomfim-mega-menu" className="site-header__mega-wrap container-site"><MegaMenu item={selected} onNavigate={() => setOpenMenu(null)} /></div>
      </>}

      {mode !== 'conversion' && <div ref={mobileDrawerRef} id="bomfim-mobile-menu" role="dialog" aria-modal={mobileOpen ? 'true' : undefined} aria-label="Menu principal" aria-hidden={!mobileOpen} inert={!mobileOpen} className={`site-header__mobile xl:hidden ${mobileOpen ? 'site-header__mobile--open' : ''}`}>
        <div className="site-header__mobile-top container-site">
          <Link to="/" aria-label="Bomfim Cargas — início" onClick={() => closeMobileMenu()}><img className="site-header__drawer-logo logo-white h-[29px] w-auto" src="/assets/brand/bomfim-cargas.webp" alt="Bomfim Cargas" /></Link>
          <button ref={mobileCloseRef} type="button" aria-label="Fechar menu" onClick={() => closeMobileMenu({ restoreFocus: true })} className="grid h-11 w-11 place-items-center rounded-full border border-white/25"><X size={22} aria-hidden="true" /></button>
        </div>
        <nav aria-label="Navegação mobile" className="site-header__mobile-body container-site">
        <p className="site-header__mobile-kicker">Navegação</p>
        <div className="site-header__mobile-groups">
          {links.map(item => item.groups || item.children?.length ? (
            <details key={item.label} className="site-header__mobile-group">
              <summary className="site-header__mobile-group-title">{item.label}<ChevronDown size={18} aria-hidden="true" /></summary>
              <div className="site-header__mobile-links">
                {item.groups ? item.groups.map(group => <section key={group.label} className="site-header__mobile-category"><h3>{group.label}</h3>{group.children.map(child => <Link key={child.href} to={child.href} onClick={() => closeMobileMenu()}><span><strong>{child.label}</strong><small>{child.description}</small></span></Link>)}</section>) : item.children.map(child => <Link key={child.label} to={child.href} onClick={() => closeMobileMenu()} aria-current={pathname === child.href ? 'page' : undefined}><span><strong>{child.label}</strong><small>{child.description}</small></span></Link>)}
                {item.action && <Link className="site-header__mobile-overview" to={item.action.href} onClick={() => closeMobileMenu()}>{item.action.label} →</Link>}
              </div>
            </details>
          ) : <Link key={item.label} to={item.href} onClick={() => closeMobileMenu()} className="site-header__mobile-direct" aria-current={pathname === item.href ? 'page' : undefined}>{item.label}<span aria-hidden="true">→</span></Link>)}
        </div>
        <div className="site-header__mobile-actions">
          <Button href="/cotacao" variant="white" size="sm">Fazer uma cotação</Button>
          <Button href="/comercial" variant="on-dark" size="sm">Falar com comercial</Button>
        </div>
        {(mode === 'site' || mode === 'content' || mode === 'returning') && <div className="site-header__mobile-utilities"><button type="button" onClick={() => {closeMobileMenu();if(mode === 'returning') document.getElementById('tracking-reference-home')?.focus(); else window.dispatchEvent(new Event('bomfim:track'))}} className="flex min-h-11 items-center gap-2 text-sm"><PackageSearch size={17} aria-hidden="true" />Rastrear uma carga</button><a href="https://cliente.bomfimcargas.com.br" target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 text-sm"><UserRound size={17} aria-hidden="true" />Área do Cliente</a></div>}
        </nav>
      </div>}
    </header>
  )
}
