import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const messages = {
  '/lp/cotacao': 'Olá! Vim pelo site e preciso cotar um embarque. Podem me orientar?',
  '/lp/cotacao-completa': 'Olá! Vim pelo site para preencher uma cotação completa. Podem me orientar?',
  '/lp/embarques-frequentes': 'Olá! Minha empresa tem embarques frequentes e quero avaliar rotas e frequência.',
  '/lp/falar-comercial': 'Olá! Gostaria de falar com a equipe comercial sobre a operação da minha empresa.',
}

export default function ConversionWhatsApp({ pathname }) {
  const [formVisible, setFormVisible] = useState(false)
  const message = messages[pathname]
  useEffect(() => {
    if (!window.matchMedia('(max-width: 800px)').matches) return undefined
    if (!('IntersectionObserver' in window)) return undefined
    let observer
    let frame
    const attach = () => {
      const form = document.querySelector('.conversion-hero__form-wrap')
      if (!form) { frame = requestAnimationFrame(attach); return }
      observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.01 })
      observer.observe(form)
    }
    frame = requestAnimationFrame(attach)
    return () => { cancelAnimationFrame(frame); observer?.disconnect() }
  }, [pathname])
  if (!message) return null
  const href = `https://wa.me/558003388700?text=${encodeURIComponent(message)}`
  return <a className={`conversion-whatsapp ${formVisible ? 'conversion-whatsapp--hidden' : ''}`} href={href} target="_blank" rel="noopener noreferrer" aria-label="Falar pelo WhatsApp no 0800 338 8700" aria-hidden={formVisible} tabIndex={formVisible ? -1 : 0}>
    <span className="conversion-whatsapp__portrait" aria-hidden="true"><img src="/assets/visuals-2026/04-hero-atendimento.webp" alt="" loading="lazy" /><span className="conversion-whatsapp__brand"><MessageCircle size={15} strokeWidth={2.8} /></span></span>
    <span><strong>Fale com a equipe</strong><small>WhatsApp · 0800 338 8700</small></span>
  </a>
}
