import { Suspense, useDeferredValue, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { lazyPage as lazy } from './utils/pageLoading.js'
import NavigationPrefetch from './components/NavigationPrefetch.jsx'
import PageLoadBoundary from './components/PageLoadBoundary.jsx'
const InstitutionalPage = lazy(() => import('./pages/Institutional.jsx'))
const BrandTests = lazy(() => import('./pages/BrandTests.jsx'))
const ThankYouPage = lazy(() => import('./pages/ThankYou.jsx'))
import HomeReturnNotice from './components/HomeReturnNotice.jsx'
import { applyPageMetadata } from './data/pageMetadata.js'
import { Link, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import DeliveryAlert from './components/DeliveryAlert.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import ConversionWhatsApp from './components/ConversionWhatsApp.jsx'
import LandingTelemetry from './components/LandingTelemetry.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import ScrollMotion from './components/ScrollMotion.jsx'
import Home from './pages/Home.jsx'
const ReturningHome = lazy(() => import('./pages/ReturningHome.jsx'))
const RoutesPage = lazy(() => import('./pages/Routes.jsx').then(module => ({ default: module.RoutesPage })))
const RoutePlanningPage = lazy(() => import('./pages/Routes.jsx').then(module => ({ default: module.RoutePlanningPage })))
const CorridorPage = lazy(() => import('./pages/Routes.jsx').then(module => ({ default: module.CorridorPage })))
const ContentPage = lazy(() => import('./pages/Content.jsx').then(module => ({ default: module.ContentPage })))
const ArticlePage = lazy(() => import('./pages/Content.jsx').then(module => ({ default: module.ArticlePage })))
const LandingPage = lazy(() => import('./campaigns/LandingPage.jsx'))
const LandingShowcase = lazy(() => import('./campaigns/LandingShowcase.jsx'))
const ConversionPage = lazy(() => import('./pages/Conversion.jsx'))
const QuoteWizard = lazy(() => import('./pages/QuoteWizard.jsx'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail.jsx'))
const NotificationsPage = lazy(() => import('./pages/Notifications.jsx'))
const SolutionsOverview = lazy(() => import('./pages/SolutionsOverview.jsx'))
const DesignSystem = lazy(() => import('./pages/DesignSystem.jsx'))
const VisualLibrary = lazy(() => import('./pages/VisualLibrary.jsx'))
const ContactPage = lazy(() => import('./pages/Information.jsx').then(module => ({ default: module.ContactPage })))
const ClientPage = lazy(() => import('./pages/Information.jsx').then(module => ({ default: module.ClientPage })))
const PrivacyPage = lazy(() => import('./pages/Information.jsx').then(module => ({ default: module.PrivacyPage })))
const UnitsPage = lazy(() => import('./pages/Units.jsx'))
import { Dialog, Button, Field } from './components/UI.jsx'
import { PackageSearch } from 'lucide-react'



function TrackDialog({ open, onClose }) {
  const [reference, setReference] = useState('')
  return <Dialog open={open} onClose={onClose} titleId="tracking-title" className={`tracking-dialog ${open ? 'tracking-dialog--open' : ''}`}>
    <p className="eyebrow">Área do Cliente</p><h2 id="tracking-title" className="heading mt-3 pr-8 text-3xl">Rastreie sua carga</h2>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">A consulta segura acontece no portal oficial Bomfim. Informe seu documento ou código de rastreio para continuar.</p>
    <form className="mt-6 grid gap-4" onSubmit={e => {e.preventDefault(); window.open(`https://cliente.bomfimcargas.com.br/rastreamento${reference ? `?q=${encodeURIComponent(reference)}` : ''}`, '_blank', 'noopener,noreferrer'); onClose()}}>
      <Field id="tracking-reference" label="CPF/CNPJ ou código da carga" value={reference} onChange={e => setReference(e.target.value)} placeholder="Digite seu documento ou código" />
      <Button type="submit">Continuar no portal <PackageSearch size={18} /></Button>
      <a className="text-center text-sm font-semibold text-[var(--brand)] underline" href="https://cliente.bomfimcargas.com.br" target="_blank" rel="noreferrer">Abrir Área do Cliente</a>
    </form>
  </Dialog>
}

function TrackLauncher() {
  const [open, setOpen] = useState(false)
  useEffect(() => { const onOpen = () => setOpen(true); window.addEventListener('bomfim:track', onOpen); return () => window.removeEventListener('bomfim:track', onOpen) }, [])
  return <TrackDialog open={open} onClose={() => setOpen(false)} />
}

function PageNavigation({ location }) {
  const navigationType = useNavigationType()
  const scrollPositions = useRef(new Map())
  const previousPath = useRef(location.pathname)
  const previousRoute = useRef(`${location.pathname}${location.hash}`)
  useLayoutEffect(() => {
    applyPageMetadata(location.pathname)
    const route = `${location.pathname}${location.hash}`
    if (route !== previousRoute.current) {
      const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null
      if (target) target.scrollIntoView({ behavior: previousPath.current === location.pathname && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant' })
      else if (navigationType === 'POP' && scrollPositions.current.has(location.key)) window.scrollTo({ top: scrollPositions.current.get(location.key), behavior: 'instant' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    }
    if (previousPath.current !== location.pathname) requestAnimationFrame(() => {
      const heading = document.querySelector('#main-content h1')
      heading?.setAttribute('tabindex', '-1')
      heading?.focus({ preventScroll: true })
    })
    previousPath.current = location.pathname
    previousRoute.current = route
    return () => scrollPositions.current.set(location.key, window.scrollY)
  }, [location.key, location.pathname, location.hash, navigationType])
  return null
}

function SitePages({ location }) {
  const { pathname } = location
  const routePlanner = pathname === '/rotas/planejar' || pathname === '/estudo-marca-bomfim'
  const homePage = pathname === '/'
  const landing = pathname.startsWith('/campanhas/') && pathname !== '/campanhas'
  const paidLanding = pathname.startsWith('/lp/')
  const thankYou = pathname.startsWith('/obrigado/') || /^\/campanhas\/[^/]+\/obrigado\//.test(pathname)
  const returningHome = pathname === '/inicio-recorrente'
  const contentPortal = pathname === '/conteudos' || pathname.startsWith('/conteudos/')
  return <>
    <PageNavigation location={location} />
    <a href="#main-content" className="visually-hidden focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:h-auto focus:w-auto focus:overflow-visible focus:whitespace-normal focus:rounded-lg focus:bg-white focus:p-3">Pular para o conteúdo</a>
    {!routePlanner && !thankYou && pathname !== '/campanhas' && <SiteHeader mode={landing || paidLanding ? 'conversion' : returningHome ? 'returning' : contentPortal ? 'content' : 'site'} />}
    {homePage && <CookieConsent enabled placement="inline" />}
    <DeliveryAlert enabled={!routePlanner && !landing && !paidLanding && !thankYou && !homePage} />
    <LandingTelemetry pathname={pathname} />
    {!thankYou && <TrackLauncher />}
    {pathname === "/" && <HomeReturnNotice />}
    <div id="main-content" key={pathname} className={pathname === '/' ? 'page-surface page-surface--home' : 'page-surface'}>
      <Routes location={location}>
        <Route path="/campanhas" element={<LandingShowcase />} />
        <Route path="/" element={<Home />} />
        <Route path="/inicio-recorrente" element={<ReturningHome />} />
        <Route path="/rotas" element={<RoutesPage />} />
        <Route path="/estudo-marca-bomfim" element={<BrandTests />} />
        <Route path="/rotas/planejar" element={<RoutePlanningPage />} />
        <Route path="/rotas/:id" element={<CorridorPage />} />
        <Route path="/conteudos" element={<ContentPage />} />
        <Route path="/conteudos/:slug" element={<ArticlePage />} />
        <Route path="/solucoes" element={<SolutionsOverview />} />
        <Route path="/solucoes/:slug" element={<ServiceDetail />} />
        <Route path="/tecnologia" element={<InstitutionalPage pageKey="tecnologia" />} />
        <Route path="/estrutura" element={<InstitutionalPage pageKey="estrutura" />} />
        <Route path="/quem-somos" element={<InstitutionalPage pageKey="quem-somos" />} />
        <Route path="/contato" element={<ConversionPage kind="contact" />} />
        <Route path="/comercial" element={<ConversionPage kind="commercial" />} />
        <Route path="/cotacao" element={<QuoteWizard />} />
        <Route path="/coleta" element={<ConversionPage kind="collection" />} />
        <Route path="/unidades" element={<UnitsPage />} />
        <Route path="/canal-de-denuncias" element={<ContactPage report />} />
        <Route path="/avisos" element={<NotificationsPage />} />
        <Route path="/aviso-de-entrega" element={<NotificationsPage />} />
        <Route path="/campanhas/:campaign/obrigado/:kind" element={<ThankYouPage />} />
        <Route path="/obrigado/:kind" element={<ThankYouPage />} />
        <Route path="/area-do-cliente" element={<ClientPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/campanhas/descoberta" element={<LandingPage variant="descoberta" />} />
        <Route path="/campanhas/consideracao" element={<LandingPage variant="consideracao" />} />
        <Route path="/campanhas/decisao" element={<LandingPage variant="decisao" />} />
        <Route path="/campanhas/retorno" element={<LandingPage variant="retorno" />} />
        <Route path="/lp/cotacao" element={<ConversionPage kind="quote" dedicated />} />
        <Route path="/lp/cotacao-completa" element={<QuoteWizard />} />
        <Route path="/lp/embarques-frequentes" element={<ConversionPage kind="frequent" dedicated />} />
        <Route path="/lp/falar-comercial" element={<ConversionPage kind="commercial" dedicated />} />
        <Route path="/obrigado/embarques-frequentes" element={<ThankYouPage />} />
        <Route path="/obrigado/comercial" element={<ThankYouPage />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/biblioteca-visual" element={<VisualLibrary />} />
        <Route path="*" element={<main className="container-site section-space"><h1 className="heading text-4xl">Página não encontrada</h1><p className="mt-3 text-[var(--muted)]">O endereço ainda não faz parte deste protótipo.</p><Link to="/" className="mt-5 inline-block font-bold text-[var(--brand)]">Voltar ao início</Link></main>} />
      </Routes>
    </div>
    <ScrollMotion pathname={pathname} />
    {!routePlanner && !thankYou && pathname !== '/campanhas' && !paidLanding && <SiteFooter compact={landing} />}
    {paidLanding && <ConversionWhatsApp pathname={pathname} />}
    {!paidLanding && !landing && !homePage && <CookieConsent enabled={!thankYou} />}
  </>
}

function getPage(path) {
  if (path === '/rotas/planejar') return RoutePlanningPage
  if (path === '/rotas' || path.startsWith('/rotas/')) return RoutesPage
  if (path === '/solucoes') return SolutionsOverview
  if (path.startsWith('/solucoes/')) return ServiceDetail
  if (['/estrutura', '/tecnologia', '/quem-somos'].includes(path)) return InstitutionalPage
  if (['/contato', '/comercial', '/coleta'].includes(path)) return ConversionPage
  if (path === '/cotacao' || path === '/lp/cotacao-completa') return QuoteWizard
  if (path === '/conteudos' || path.startsWith('/conteudos/')) return ContentPage
  if (path === '/campanhas') return LandingShowcase
  if (path.startsWith('/obrigado/') || /\/obrigado\//.test(path)) return ThankYouPage
  if (path.startsWith('/campanhas/')) return LandingPage
  return ({ '/unidades': UnitsPage, '/inicio-recorrente': ReturningHome, '/avisos': NotificationsPage, '/aviso-de-entrega': NotificationsPage, '/privacidade': PrivacyPage, '/area-do-cliente': ClientPage, '/canal-de-denuncias': ContactPage, '/design-system': DesignSystem, '/biblioteca-visual': VisualLibrary, '/estudo-marca-bomfim': BrandTests })[path]
}

export default function App() {
  const requestedLocation = useLocation()
  const displayedLocation = useDeferredValue(requestedLocation)
  const pending = requestedLocation !== displayedLocation
  return <>
    <NavigationPrefetch getPage={getPage} />
    {pending && <div className="navigation-progress" role="status"><span className="visually-hidden">Carregando próxima página…</span></div>}
    <PageLoadBoundary><Suspense fallback={<div className="route-loading" role="status"><img src={`${import.meta.env.BASE_URL}assets/brand/bomfim-cargas.webp`} width="150" height="48" alt="Bomfim Cargas" /><p>Preparando sua página…</p></div>}>
      <div aria-busy={pending}><SitePages location={displayedLocation} /></div>
    </Suspense></PageLoadBoundary>
  </>
}
