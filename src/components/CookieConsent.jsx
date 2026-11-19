import { forgetContactMemory } from '../utils/contactMemory.js'
import { useEffect, useState } from 'react'

const storageKey = 'bomfim:consent:v2'
const defaults = { analytics: false, marketing: false }

function readChoice() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
    return saved?.version === 2 ? saved : null
  } catch { return null }
}

export default function CookieConsent({ enabled = true, placement = 'floating' }) {
  const [choice, setChoice] = useState(readChoice)
  const [forgotten, setForgotten] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined
    const show = () => { setForgotten(false); setOpen(true) }
    window.addEventListener('bomfim:cookie-preferences', show)
    return () => window.removeEventListener('bomfim:cookie-preferences', show)
  }, [enabled])

  function save(next) {
    const value = { version: 2, analytics: !!next.analytics, marketing: !!next.marketing, updatedAt: new Date().toISOString() }
    try { localStorage.setItem(storageKey, JSON.stringify(value)) } catch { /* Preferences stay in memory if storage is unavailable. */ }
    setChoice(value)
    setOpen(false)
    window.dispatchEvent(new CustomEvent('bomfim:consent-changed', { detail: value }))
  }

  if (!enabled || (choice && !open)) return null
  const paidLanding = window.location.pathname.startsWith('/lp/')
  return <aside className={`cookie-consent cookie-consent--simple ${paidLanding ? 'cookie-consent--paid-landing' : ''} ${placement === 'inline' ? 'cookie-consent--inline' : ''}`} aria-labelledby="cookie-title" aria-describedby="cookie-description" role="region">
    <div className="cookie-consent__inner">
      <div className="cookie-consent__copy">
        <h2 id="cookie-title">Cookies</h2>
        <p id="cookie-description">Cookies necessários mantêm o site funcionando. Se quiser, permita a medição de visitas.</p>
        {open && <div className="cookie-consent__contact-memory"><p>Você também pode apagar nome, telefone e e-mail salvos neste navegador.</p><button type="button" onClick={() => { forgetContactMemory(); setForgotten(true) }}>Apagar dados salvos</button>{forgotten && <p role="status">Dados apagados deste navegador.</p>}</div>}
      </div>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__outline" onClick={() => save(defaults)}>Só necessários</button>
        <button type="button" className="cookie-consent__primary" onClick={() => save({ analytics: true, marketing: false })}>Permitir medição</button>
      </div>
    </div>
  </aside>
}
