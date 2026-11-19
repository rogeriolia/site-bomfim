import { useEffect, useState } from 'react'
import { ArrowRight, CloudRain, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const dismissedKey = 'bomfim:delivery-alert:dismissed'

// Demonstration only. Production notices must come from an approved operational source.
export default function DeliveryAlert({ enabled = true }) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(dismissedKey) === 'true' } catch { return false }
  })

  useEffect(() => {
    if (!enabled || dismissed) return undefined
    const timer = window.setTimeout(() => setVisible(true), 3500)
    return () => window.clearTimeout(timer)
  }, [enabled, dismissed])

  function dismiss() {
    try { sessionStorage.setItem(dismissedKey, 'true') } catch { /* Dismissal stays in memory if storage is unavailable. */ }
    setDismissed(true)
  }

  if (!enabled || !visible || dismissed) return null
  return <aside className="delivery-alert" aria-label="Aviso demonstrativo de entrega" role="status">
    <div className="delivery-alert__icon"><CloudRain size={22} aria-hidden="true" /></div>
    <div className="delivery-alert__copy">
      <span className="delivery-alert__eyebrow">Aviso de entrega · Demonstração</span>
      <p>Chuva e mau tempo podem afetar algumas entregas.</p>
    </div>
    <Link to="/avisos" className="delivery-alert__link">Ver avisos <ArrowRight size={16} aria-hidden="true" /></Link>
    <button type="button" onClick={dismiss} aria-label="Não mostrar este aviso novamente nesta sessão" className="delivery-alert__close"><X size={17} aria-hidden="true" /><span>Não mostrar</span></button>
  </aside>
}
