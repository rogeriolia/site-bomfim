import { useEffect, useRef } from 'react'
import { ArrowRight, Check, MessageCircle, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

const messages = {
  contato: ['Obrigado por conversar com a Bomfim.', 'Você deu o primeiro passo para planejar seus próximos embarques.'],
  comercial: ['Recebemos sua solicitação.', 'A equipe comercial vai analisar o contexto da sua operação e retornar pelo contato informado.'],
  'embarques-frequentes': ['Vamos avaliar sua rotina.', 'Recebemos os dados dos seus embarques frequentes. O time comercial dará sequência pelo contato informado.'],
  cotacao: ['Recebemos seu pedido de cotação.', 'A equipe Bomfim vai continuar a conversa pelo contato informado.'],
  coleta: ['Seu próximo embarque começa aqui.', 'Obrigado por organizar as informações da coleta.'],
  rotas: ['Boas rotas começam com um bom planejamento.', 'Obrigado por reunir seus destinos e preparar seu contato.'],
  conteudos: ['Que bom ter você por perto.', 'Mercado, gestão e logística fazem parte dessa conversa.'],
  denuncia: ['Etapa de revisão concluída.', 'Este espaço foi preparado para tratar relatos com atenção e respeito.'],
}

function Celebration() {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return undefined
    const width = window.innerWidth
    const height = window.innerHeight
    const scale = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * scale
    canvas.height = height * scale
    context.scale(scale, scale)
    const colors = ['#e8002d', '#ffb6c4', '#d9ad5b', '#7b9db5']
    const particles = Array.from({ length: 100 }, (_, index) => {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 5
      return { x: width * (index % 2 ? .78 : .22), y: height * .26, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3, rotation: Math.random() * 6, color: colors[index % colors.length] }
    })
    let frame
    const start = performance.now()
    let previous = start
    function draw(now) {
      const elapsed = now - start
      const delta = Math.min((now - previous) / 16.67, 2)
      previous = now
      context.clearRect(0, 0, width, height)
      context.globalAlpha = Math.max(0, 1 - elapsed / 2200)
      for (const particle of particles) {
        particle.x += particle.vx * delta
        particle.y += particle.vy * delta
        particle.vy += .08 * delta
        particle.rotation += .04 * delta
        context.save()
        context.translate(particle.x, particle.y)
        context.rotate(particle.rotation)
        context.fillStyle = particle.color
        context.fillRect(-3, -2, 6, 4)
        context.restore()
      }
      if (elapsed < 2200) frame = requestAnimationFrame(draw)
      else context.clearRect(0, 0, width, height)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={canvasRef} className="thank-you__celebration" aria-hidden="true" />
}

export default function ThankYouPage() {
  const { kind } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const message = messages[kind]
  const whatsappMessages = {
    cotacao: 'Olá! Acabei de pedir uma cotação pelo site e gostaria de continuar a conversa.',
    'embarques-frequentes': 'Olá! Acabei de pedir contato sobre meus embarques frequentes.',
    comercial: 'Olá! Acabei de pedir contato da equipe comercial pelo site.',
  }
  const whatsappMessage = whatsappMessages[kind]
  const goHome = () => navigate('/', { replace: true, state: { thankYouReturn: true } })
  if (!message) return <main className="thank-you"><h1>Página não encontrada</h1><Link to="/">Voltar ao início</Link></main>
  return <main className={`thank-you ${kind === 'denuncia' ? 'thank-you--quiet' : ''}`}>
    {kind !== 'denuncia' && <Celebration />}
    <Link to="/" className="thank-you__brand" aria-label="Bomfim Cargas — início"><img src="/assets/brand/bomfim-cargas.webp" alt="Bomfim Cargas" /></Link>
    <div className="thank-you__content">
      <span className="thank-you__check" aria-hidden="true">{kind === 'denuncia' ? <ShieldCheck size={32} /> : <Check size={36} strokeWidth={2.5} />}</span>
      <h1 className="heading">{message[0]}</h1>
      <p className="thank-you__description">{message[1]}</p>
      {location.state?.demo && <p className="thank-you__demo">Modo de demonstração: os dados não foram enviados.</p>}
      <button type="button" onClick={goHome} className="thank-you__home">Voltar ao início <ArrowRight size={18} aria-hidden="true" /></button>
      {whatsappMessage && <a className="thank-you__contact" href={`https://wa.me/558003388700?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" /> Se preferir, fale pelo WhatsApp · 0800 338 8700</a>}
      <p className="thank-you__countdown">Você pode fechar esta página ou guardar esta confirmação.</p>
    </div>
  </main>
}
