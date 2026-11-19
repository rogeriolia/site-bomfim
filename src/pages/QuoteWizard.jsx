import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, MapPin, ShieldCheck } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ConversionLayout from '../components/ConversionLayout.jsx'
import RouteRegionPicker from '../components/RouteRegionPicker.jsx'
import { Button, Field } from '../components/UI.jsx'
import { readContactMemory, rememberContactField } from '../utils/contactMemory.js'

export default function QuoteWizard() {
  const [searchParams] = useSearchParams()
  const testMode = searchParams.get('mod_test') === 'true'
  const [step, setStep] = useState(0)
  const [origin, setOrigin] = useState({})
  const [destination, setDestination] = useState({})
  const [phone, setPhone] = useState(() => testMode ? '(81) 99999-9999' : readContactMemory().phone || '')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const navigate = useNavigate()
  const steps = ['Origem', 'Destino', 'Contato']
  const prettyCity = value => String(value || '').toLocaleLowerCase('pt-BR').replace(/(^|[\s'-])\p{L}/gu, letter => letter.toLocaleUpperCase('pt-BR'))
  useEffect(() => { document.querySelector('.quote-wizard__progress [aria-current="step"]')?.scrollIntoView({ block: 'nearest', inline: 'center' }) }, [step])
  const updatePhone = event => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 11)
    const formatted = digits.length < 3 ? (digits ? `(${digits}` : '') : `(${digits.slice(0,2)}) ${digits.slice(2, digits.length > 10 ? 7 : 6)}${digits.length > 6 ? `-${digits.slice(digits.length > 10 ? 7 : 6)}` : ''}`
    setPhone(formatted); rememberContactField('phone', formatted)
  }
  const moveTo = nextStep => {
    if (nextStep === step) return
    try {
      const consent = JSON.parse(localStorage.getItem('bomfim:consent:v2') || 'null')
      const sessionId = sessionStorage.getItem('bomfim:analytics-session')
      if (consent?.version === 2 && consent.analytics === true && sessionId) {
        fetch(`${import.meta.env.BASE_URL}api/telemetry.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'form_step', path: window.location.pathname, sessionId, payload: { step: steps[nextStep], stepIndex: nextStep + 1 } }), keepalive: true }).catch(() => {})
      }
    } catch { /* Route selection continues if analytics storage is unavailable. */ }
    setStep(nextStep)
  }
  const next = () => moveTo(step === 0 ? (origin.city ? 1 : 2) : 2)
  const submit = async event => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    setSubmitting(true); setSubmitError('')
    const form = new FormData(event.currentTarget)
    const payload = {
      kind: 'cotacao', name: form.get('name'), company: form.get('company'), phone,
      email: form.get('email') || '', origin: origin.city ? `${prettyCity(origin.city)} · ${origin.uf}` : '', destination: destination.city ? `${prettyCity(destination.city)} · ${destination.uf}` : '',
      originCep: origin.cep || '', destinationCep: destination.cep || '',
      message: 'Pedido de cotação inicial. Detalhes de carga, medidas, pagador e endereços completos serão definidos com atendimento.',
      testMode, requestId: crypto.randomUUID(), sessionId: sessionStorage.getItem('bomfim:analytics-session') || '',
      pageUrl: window.location.href, utm: Object.fromEntries(searchParams.entries()),
    }
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/leads.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || 'Não foi possível enviar. Tente novamente.')
      navigate('/obrigado/cotacao', { state: { demo: false } })
    } catch (error) { setSubmitError(error.message || 'Falha de conexão. Tente novamente.') }
    finally { setSubmitting(false) }
  }
  return <ConversionLayout eyebrow="Solicitar cotação" title="Vamos começar pela sua rota." body="Escolha as cidades da rota ou fale com a equipe depois." image="/assets/visuals-2026/05-hero-corredores.webp" formTitle={steps[step]} formNote={step === 0 ? 'Escolha a cidade de origem.' : step === 1 ? 'Agora escolha o destino.' : 'Deixe um contato para a equipe continuar.'} points={[{ icon: 'routes', title: 'Cidades atendidas', text: 'Escolha cidades ou consulte um CEP.' }]} className="conversion-page--quote conversion-page--dedicated conversion-page--quote-wizard">
    <form className="conversion-form quote-wizard" onSubmit={step === 2 ? submit : event => { event.preventDefault(); next() }}>
      <div className="quote-wizard__topline"><div className="quote-wizard__progress" aria-label="Etapas da cotação">{steps.map((title, index) => <span key={title} className={index <= step ? 'is-active' : ''} aria-current={index === step ? 'step' : undefined}><b>{index + 1}</b><em>{title}</em></span>)}</div></div>
      {step === 0 && <div className="quote-wizard__route-step">
        <RouteRegionPicker prefix="origin" selection={origin} onChange={setOrigin} testMode={testMode} />
        <div className="quote-wizard__route-note"><ShieldCheck size={17} aria-hidden="true" /><span>O atendimento confirma as condições do trecho com você.</span></div>
        <button type="button" className="quote-wizard__skip-route" onClick={() => moveTo(2)}>Prefiro informar a rota depois <ArrowRight size={16} aria-hidden="true" /></button>
      </div>}
      {step === 1 && <div className="quote-wizard__route-step">
        {origin.city && <div className="quote-wizard__route-summary"><MapPin size={18} aria-hidden="true" /><span>Origem: {prettyCity(origin.city)} · {origin.uf}</span><button type="button" onClick={() => moveTo(0)}>Editar</button></div>}
        <RouteRegionPicker prefix="destination" selection={destination} onChange={setDestination} testMode={testMode} />
        <div className="quote-wizard__route-note"><ShieldCheck size={17} aria-hidden="true" /><span>Você pode deixar o destino para conversar com a equipe.</span></div>
        <button type="button" className="quote-wizard__skip-route" onClick={() => moveTo(2)}>Prefiro informar depois <ArrowRight size={16} aria-hidden="true" /></button>
      </div>}
      {step === 2 && <div className="quote-wizard__contact-step">
        {(origin.city || destination.city) && <div className="quote-wizard__route-summary"><MapPin size={18} aria-hidden="true" /><span>{origin.city ? `${prettyCity(origin.city)} · ${origin.uf}` : 'Origem a definir'} <b>→</b> {destination.city ? `${prettyCity(destination.city)} · ${destination.uf}` : 'Destino a definir'}</span><button type="button" onClick={() => moveTo(origin.city ? 1 : 0)}>Editar rota</button></div>}
        <Field id="quote-name" name="name" label="Seu nome" placeholder="Nome e sobrenome" required autoComplete="name" defaultValue={testMode ? 'Teste Bomfim' : readContactMemory().name || ''} />
        <Field id="quote-company" name="company" label="Empresa" placeholder="Nome da empresa" required autoComplete="organization" defaultValue={testMode ? 'Empresa de Teste' : readContactMemory().company || ''} />
        <Field id="quote-phone" name="phone" label="WhatsApp com DDD" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={updatePhone} pattern="\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}" title="Informe um telefone com DDD" placeholder="(81) 99999-9999" required />
        <details className="conversion-form__more"><summary>Adicionar e-mail (opcional)</summary><Field id="quote-email" name="email" label="E-mail" type="email" inputMode="email" autoComplete="email" defaultValue={testMode ? 'apolo+cliente@4lia.com.br' : readContactMemory().email || ''} placeholder="nome@empresa.com.br" /></details>
        <label className="conversion-form__consent"><input type="checkbox" required defaultChecked={testMode} /><span>Concordo com a <Link to="/privacidade">Política de Privacidade</Link>.</span></label>
        {testMode && <p className="conversion-form__test" role="status">Teste ativo. A confirmação vai para o e-mail de teste e usa CEPs atendidos reais: Recife e João Pessoa.</p>}
      </div>}
      {submitError && <p className="conversion-form__error" role="alert">{submitError}</p>}
      <div className="quote-wizard__actions">{step > 0 && <Button type="button" variant="outline" onClick={() => moveTo(step === 2 ? (origin.city ? 1 : 0) : 0)}><ArrowLeft size={17} />Voltar</Button>}<Button type="submit" disabled={submitting}>{submitting ? 'Enviando…' : step === 2 ? 'Pedir cotação' : 'Continuar'} <ArrowRight size={17} /></Button></div>
      <p className="conversion-form__disclaimer">Sem CNPJ, medidas ou nota fiscal nesta etapa.</p>
    </form>
  </ConversionLayout>
}
