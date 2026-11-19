import { useEffect } from 'react'

const landingPaths = new Set(['/lp/cotacao', '/lp/cotacao-completa', '/lp/embarques-frequentes', '/lp/falar-comercial'])
const consentKey = 'bomfim:consent:v2'
function analyticsAllowed() {
  try { const value = JSON.parse(localStorage.getItem(consentKey) || 'null'); return value?.version === 2 && value.analytics === true } catch { return false }
}
function sessionId() {
  try {
    let id = sessionStorage.getItem('bomfim:analytics-session')
    if (!id) { id = crypto.randomUUID(); sessionStorage.setItem('bomfim:analytics-session', id) }
    return id
  } catch { return crypto.randomUUID() }
}

export default function LandingTelemetry({ pathname }) {
  useEffect(() => {
    if (!landingPaths.has(pathname)) return undefined
    let active = analyticsAllowed()
    let id = active ? sessionId() : null
    let lastPointerAt = 0
    let highestScrollBucket = 0
    let formStarted = false
    const path = pathname
    const send = (type, extra = {}, beacon = false) => {
      if (!active || !id) return
      const payload = { type, path, sessionId: id, referrer: document.referrer, utm: Object.fromEntries(new URLSearchParams(location.search)), ...extra }
      const url = `${import.meta.env.BASE_URL}api/telemetry.php`
      const body = JSON.stringify(payload)
      if (beacon && navigator.sendBeacon) { navigator.sendBeacon(url, new Blob([body], { type: 'application/json' })); return }
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true, credentials: 'same-origin' }).catch(() => {})
    }
    const refreshConsent = () => {
      const allowed = analyticsAllowed()
      if (allowed && !active) { active = true; id = sessionId(); send('page_view', { payload: { viewportWidth: innerWidth, viewportHeight: innerHeight, screenHeight: document.documentElement.scrollHeight } }) }
      if (!allowed) { active = false; id = null }
    }
    if (active) send('page_view', { payload: { viewportWidth: innerWidth, viewportHeight: innerHeight, screenHeight: document.documentElement.scrollHeight } })
    const heartbeat = window.setInterval(() => send('heartbeat'), 30000)
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight)
      const depth = Math.min(100, Math.round((scrollY / max) * 100))
      const bucket = Math.floor(depth / 10) * 10
      if (bucket > highestScrollBucket) { highestScrollBucket = bucket; send('scroll', { payload: { scrollDepth: bucket, viewportWidth: innerWidth, viewportHeight: innerHeight, screenHeight: document.documentElement.scrollHeight } }) }
    }
    const onPointerMove = event => {
      if (event.pointerType !== 'mouse' || Date.now() - lastPointerAt < 700) return
      lastPointerAt = Date.now()
      send('pointer_move', { x: event.clientX / Math.max(1, innerWidth), y: (scrollY + event.clientY) / Math.max(1, document.documentElement.scrollHeight) })
    }
    const onClick = event => {
      if (event.target.closest('input,textarea,select,[contenteditable="true"]')) return
      const target = event.target.closest('a,button,[role="button"]')
      if (!target) return
      const rect = target.getBoundingClientRect()
      const label = (target.getAttribute('aria-label') || target.innerText || target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80)
      send('click', { x: (event.clientX || rect.left + rect.width / 2) / Math.max(1, innerWidth), y: (scrollY + (event.clientY || rect.top + rect.height / 2)) / Math.max(1, document.documentElement.scrollHeight), payload: { control: target.tagName.toLowerCase(), label, section: target.closest('form')?.querySelector('h2')?.textContent?.slice(0, 80) || '' } })
    }
    const onFocus = event => {
      if (!formStarted && event.target.closest('.conversion-form')) { formStarted = true; send('form_start', { payload: { control: event.target.name || event.target.id || 'field' } }) }
    }
    const onSubmit = event => { if (event.target.matches('.conversion-form')) send('form_submit', { payload: { control: 'conversion-form' } }) }
    window.addEventListener('bomfim:consent-changed', refreshConsent)
    document.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('click', onClick, { passive: true })
    document.addEventListener('focusin', onFocus, true)
    document.addEventListener('submit', onSubmit, true)
    return () => {
      window.clearInterval(heartbeat)
      window.removeEventListener('bomfim:consent-changed', refreshConsent)
      document.removeEventListener('scroll', onScroll); document.removeEventListener('pointermove', onPointerMove); document.removeEventListener('click', onClick); document.removeEventListener('focusin', onFocus, true); document.removeEventListener('submit', onSubmit, true)
    }
  }, [pathname])
  return null
}
