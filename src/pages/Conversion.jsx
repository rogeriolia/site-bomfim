import pageCatalog from '../data/pageCatalog.json'
import { ArrowRight } from 'lucide-react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import ConversionLayout from '../components/ConversionLayout.jsx'
import { Button, Field } from '../components/UI.jsx'
import routes from '../data/routes.json'
import { useEffect, useState } from 'react'
import { readContactMemory, rememberContactField } from '../utils/contactMemory.js'

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 3) return digits ? `(${digits}` : ''
  const area = `(${digits.slice(0, 2)}) `
  const rest = digits.slice(2)
  return `${area}${rest.length > 4 ? `${rest.slice(0, rest.length > 8 ? 5 : 4)}-${rest.slice(rest.length > 8 ? 5 : 4)}` : rest}`
}

const pages = {
  contact: { eyebrow: 'Fale com a Bomfim', title: 'Como podemos ajudar?', body: 'Deixe seu contato. A equipe Bomfim conversa com você e direciona o atendimento.', image: '/assets/visuals-2026/10-atendimento.webp', formTitle: 'Entre em contato', formNote: 'Conte brevemente como podemos ajudar.', points: [{ icon: 'people', title: 'Atendimento direcionado', text: 'Sua mensagem segue para a equipe responsável.' }, { icon: 'operation', title: 'Dúvidas e orientações', text: 'Fale sobre serviços, unidades ou atendimento.' }] },
  commercial: { eyebrow: 'Falar com comercial', title: 'Vamos planejar sua operação.', body: 'Fale com a equipe comercial sobre a operação da sua empresa.', image: '/assets/visuals-2026/04-hero-atendimento.webp', formTitle: 'Fale com o comercial', formNote: 'Deixe seu contato para receber um retorno.', points: [{ icon: 'people', title: 'Atendimento pessoal', text: 'A equipe conversa com você.' }] },
  quote: { eyebrow: 'Solicitar cotação', title: 'Cote seu próximo embarque.', body: 'Deixe seu contato. A equipe continua a cotação com você.', image: '/assets/visuals-2026/05-hero-corredores.webp', formTitle: 'Solicitar cotação', formNote: 'Comece com seus dados de contato.', points: [{ icon: 'routes', title: 'Rota definida com a equipe', text: 'Os detalhes ficam para a conversa.' }] },
  collection: { eyebrow: 'Solicitar coleta', title: 'Organize o ponto de partida da sua carga.', body: 'Deixe seu contato. A equipe combina os detalhes e confirma as condições da coleta com você.', image: '/assets/visuals-2026/03-hero-coleta.webp', formTitle: 'Dados da coleta', formNote: 'Informe o necessário para avaliar a solicitação.', points: [{ icon: 'cargo', title: 'Carga identificada', text: 'Detalhe volumes e particularidades.' }, { icon: 'routes', title: 'Local de coleta', text: 'Origem e destino orientam a análise.' }, { icon: 'operation', title: 'Janela confirmada', text: 'O agendamento depende de validação operacional.' }] },
  frequent: { eyebrow: 'Embarques frequentes', title: 'Planeje seus embarques.', body: 'Converse sobre a rotina de envios da sua empresa.', image: '/assets/visuals-2026/16-hero-home-recorrente.webp', formTitle: 'Embarques frequentes', formNote: 'Deixe seu contato para conversar sobre os envios.', points: [{ icon: 'operation', title: 'Rotas e frequência', text: 'A equipe ajuda a organizar os detalhes.' }] },
}

function getRouteContext(params) {
  const ids = (params.get('rotas') || '').split(',')
  const selected = ids.map(id => routes.find(route => route.id === id)).filter(Boolean)
  let extras = []
  try { const parsed = JSON.parse(params.get('extras') || '[]'); if (Array.isArray(parsed)) extras = parsed.filter(item => typeof item.origin === 'string' && typeof item.destination === 'string').slice(0, 20) } catch { /* Ignore malformed link context. */ }
  return [...selected.map(item => `${item.origin} → ${item.destination}`), ...extras.map(item => `${item.origin.slice(0, 60)} → ${item.destination.slice(0, 60)}`)]
}

const campaignPages = {
  descoberta: { eyebrow: 'Planejamento de rotas', title: 'Sua próxima rota começa aqui.', body: 'Conte quais cidades sua empresa precisa conectar.', image: '/assets/visuals-2026/05-hero-corredores.webp', formTitle: 'Comece por aqui', formNote: 'Só o essencial para iniciar a conversa.', points: [{ icon: 'routes', title: 'Rotas da sua operação', text: 'Compartilhe as cidades que precisa atender.' }, { icon: 'operation', title: 'Frequência de embarque', text: 'Conte se envia de forma pontual ou recorrente.' }, { icon: 'people', title: 'Apoio humano', text: 'Leve as dúvidas certas para o time comercial.' }] },
  consideracao: { eyebrow: 'Análise de operação', title: 'Entenda o que suas rotas precisam.', body: 'Organize destinos e frequência para uma conversa mais útil.', image: '/assets/visuals-2026/04-hero-atendimento.webp', formTitle: 'Vamos analisar juntos', formNote: 'Comece pelo essencial. Os detalhes podem vir depois.', points: [{ icon: 'routes', title: 'Rotas prioritárias', text: 'Reúna os destinos mais importantes.' }, { icon: 'operation', title: 'Desafio principal', text: 'Prazo, visibilidade ou distribuição.' }, { icon: 'people', title: 'Avaliação orientada', text: 'Uma conversa sobre a realidade da empresa.' }] },
  decisao: { eyebrow: 'Contato comercial', title: 'Vamos falar da sua operação.', body: 'Deixe seus dados e a equipe ajuda a avaliar o próximo passo.', image: '/assets/visuals-2026/01-hero-pessoas.webp', formTitle: 'Fale com a equipe', formNote: 'Preencha seus dados para começar.', points: [{ icon: 'routes', title: 'Rotas prioritárias', text: 'Origem e destino no mesmo contexto.' }, { icon: 'cargo', title: 'Perfil da carga', text: 'Características que influenciam o planejamento.' }, { icon: 'people', title: 'Próximo passo claro', text: 'Avaliação comercial com informações úteis.' }] },
  retorno: { eyebrow: 'Continue seu planejamento', title: 'Vamos retomar suas rotas?', body: 'Compartilhe seu contato e o ponto em que sua análise parou.', image: '/assets/visuals-2026/10-atendimento.webp', formTitle: 'Retome a conversa', formNote: 'Diga como podemos continuar.', points: [{ icon: 'routes', title: 'Destinos reunidos', text: 'Evite repetir a busca de cada rota.' }, { icon: 'operation', title: 'Dúvidas pendentes', text: 'Conte o que ainda precisa decidir.' }, { icon: 'people', title: 'Continuidade', text: 'Um próximo passo mais simples.' }] },
}

export default function ConversionPage({ kind = 'contact', campaign, preview = false, dedicated = false }) {
  const originalConfig = campaign ? campaignPages[campaign] || campaignPages.descoberta : pages[kind] || pages.contact
  const editorial = dedicated ? null : pageCatalog[campaign ? `/campanhas/${campaign}` : ({ contact: '/contato', commercial: '/comercial', quote: '/cotacao', collection: '/coleta' }[kind])]
  const config = editorial ? { ...originalConfig, title: editorial.heading, body: editorial.description, image: editorial.image } : originalConfig
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const isTestMode = params.get('mod_test') === 'true'
  const [phone, setPhone] = useState(() => isTestMode ? '(81) 99999-9999' : (readContactMemory().phone || ''))
  const context = getRouteContext(params)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [attentionNudge, setAttentionNudge] = useState(false)
  const kindType = { quote: 'cotacao', frequent: 'embarques-frequentes', commercial: 'comercial', collection: 'cotacao' }[kind] || 'comercial'
  useEffect(() => {
    if (!isTestMode) return
    const form = document.querySelector('.conversion-form')
    if (!form) return
    const values = { name: 'Teste Bomfim', company: 'Empresa de Teste', email: 'apolo+cliente@4lia.com.br' }
    for (const [name, value] of Object.entries(values)) { const field = form.elements.namedItem(name); if (field && 'value' in field) field.value = value }
    const consent = form.querySelector('input[type="checkbox"]'); if (consent) consent.checked = true
  }, [isTestMode, kind])
  useEffect(() => {
    if (!dedicated || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let engaged = false
    const stop = () => { engaged = true; window.clearTimeout(timer); setAttentionNudge(false) }
    const timer = window.setTimeout(() => { if (!engaged) setAttentionNudge(true) }, 5000)
    window.addEventListener('pointerdown', stop, { once: true, passive: true })
    window.addEventListener('keydown', stop, { once: true })
    window.addEventListener('touchstart', stop, { once: true, passive: true })
    return () => { window.clearTimeout(timer); window.removeEventListener('pointerdown', stop); window.removeEventListener('keydown', stop); window.removeEventListener('touchstart', stop) }
  }, [dedicated])
  function startForm() {
    setAttentionNudge(false)
    const form = document.querySelector('.conversion-page--dedicated .conversion-form')
    const fields = form ? [...form.querySelectorAll('input:not([type="checkbox"]):not([type="hidden"]), select, textarea')] : []
    const firstEmpty = fields.find(field => !field.value.trim()) || fields[0]
    form?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' })
    window.setTimeout(() => firstEmpty?.focus({ preventScroll: true }), 350)
  }
  async function submitLead(event) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    if (preview) { window.alert('Prévia interativa: o formulário está preenchido corretamente. Nenhum dado foi enviado.'); return }
    setSubmitting(true); setSubmitError('')
    const payload = Object.fromEntries(new FormData(form).entries())
    payload.kind = kindType
    payload.testMode = isTestMode
    payload.requestId = crypto.randomUUID()
    payload.sessionId = sessionStorage.getItem('bomfim:analytics-session') || ''
    payload.pageUrl = window.location.href
    payload.utm = Object.fromEntries(new URLSearchParams(window.location.search))
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/leads.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || 'Não foi possível enviar. Tente novamente.')
      navigate(`/obrigado/${kindType}`, { state: { demo: false } })
    } catch (error) { setSubmitError(error.message || 'Falha de conexão. Tente novamente.') }
    finally { setSubmitting(false) }
  }
  const paidConfig = dedicated ? { ...config, points: config.points.slice(0, 1) } : config
  return <ConversionLayout {...paidConfig} onStartForm={dedicated ? startForm : undefined} primaryAction={kind === 'quote' ? 'Pedir cotação' : kind === 'frequent' ? 'Falar sobre envios' : 'Falar com comercial'} className={`conversion-page--${kind} ${dedicated ? `conversion-page--dedicated ${attentionNudge ? 'has-attention-nudge' : ''}` : ''} ${preview ? 'conversion-page--preview' : ''}`}>
    <form className="conversion-form" onChange={event => { if (['name', 'company', 'email', 'phone'].includes(event.target.name)) rememberContactField(event.target.name, event.target.value) }} onSubmit={submitLead}>
      {context.length > 0 && <div className="conversion-form__routes"><div><strong>{context.length} {context.length === 1 ? 'destino selecionado' : 'destinos selecionados'}</strong><ul>{context.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div><Link to="/rotas">Editar rotas</Link></div>}
      <Field id={`cv-${kind}-name`} name="name" label="Seu nome" required autoComplete="name" placeholder="Nome e sobrenome" />
      <Field id={`cv-${kind}-company`} name="company" label="Empresa" required autoComplete="organization" placeholder="Nome da empresa" />
      <Field id={`cv-${kind}-phone`} name="phone" label="WhatsApp com DDD" required type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={event => setPhone(formatPhone(event.target.value))} pattern="\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}" title="Informe um telefone com DDD" placeholder="(11) 99999-9999" />
      <details className="conversion-form__more"><summary>Adicionar e-mail (opcional)</summary><Field id={`cv-${kind}-email`} name="email" label="E-mail" type="email" inputMode="email" autoComplete="email" placeholder="nome@empresa.com.br" /></details>
      {kind === 'quote' && <p className="conversion-form__wizard-link">Quer informar origem e destino agora? <Link to="/lp/cotacao-completa">Escolher minha rota <ArrowRight size={15} aria-hidden="true" /></Link></p>}
      {!dedicated && <p className="conversion-form__simple-note">Na primeira conversa, só precisamos dos seus dados de contato. O time combina os detalhes da operação com você.</p>}
      <label className="conversion-form__consent"><input type="checkbox" required /><span>Concordo com a <Link to="/privacidade">Política de Privacidade</Link>.</span></label>
      {submitError && <p className="conversion-form__error" role="alert">{submitError}</p>}
      <Button type="submit" disabled={submitting} className="conversion-form__submit">{submitting ? 'Enviando…' : kind === 'quote' ? 'Pedir cotação' : kind === 'frequent' ? 'Falar sobre envios' : 'Falar com comercial'} <ArrowRight size={18} aria-hidden="true" /></Button>
      <p className="conversion-form__disclaimer">Seus dados serão usados para responder a esta solicitação.</p>
      {isTestMode && <p className="conversion-form__test" role="status">Modo de teste ativo: os dados serão enviados ao endereço interno de teste.</p>}
    </form>
  </ConversionLayout>
}
