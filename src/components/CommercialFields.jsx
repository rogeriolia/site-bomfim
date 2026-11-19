import { useEffect, useState } from 'react'
import { CalendarClock, CalendarDays, CalendarCheck, CircleHelp, Factory, ShoppingBasket, Shirt, Armchair, Monitor, Package, MapPin } from 'lucide-react'
import { Field } from './UI.jsx'
import '../styles/commercial-fields.css'

const cepCache = new Map()
const maskCep = value => value.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')

function CommercialLocation({ name, label }) {
  const [cep, setCep] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState('')
  const [address, setAddress] = useState('')
  const [retry, setRetry] = useState(0)
  const digits = cep.replace(/\D/g, '')
  useEffect(() => {
    if (digits.length !== 8) return
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let active = true
    const lookup = async () => {
      setStatus('loading')
      try {
        let data = cepCache.get(digits)
        if (!data) {
          const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: controller.signal })
          if (!response.ok) throw new Error('Consulta indisponível')
          data = await response.json()
          if (data.erro || !data.localidade || !data.uf) throw new Error('CEP não encontrado')
          if (cepCache.size >= 30) cepCache.delete(cepCache.keys().next().value)
          cepCache.set(digits, data)
        }
        if (!active) return
        setCity(`${data.localidade} · ${data.uf}`)
        setAddress([data.logradouro, data.bairro].filter(Boolean).join(' · '))
        setStatus('success')
      } catch {
        if (active) setStatus('error')
      } finally { clearTimeout(timeout) }
    }
    lookup()
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [digits, retry])
  const message = status === 'loading' ? 'Buscando cidade…' : status === 'success' ? `Cidade preenchida. ${address || 'Você pode ajustar abaixo.'}` : status === 'error' ? 'Não foi possível consultar. Informe a cidade abaixo ou tente novamente.' : 'Digite o CEP para preencher a cidade, ou informe a cidade abaixo.'
  return <fieldset className="commercial-location">
    <legend><MapPin size={16} aria-hidden="true" />{label}</legend>
    <Field id={`commercial-${name}-cep`} name={`${name}Cep`} label="CEP" value={cep} onChange={event => { setCep(maskCep(event.target.value)); setCity(''); setAddress(''); setStatus('') }} inputMode="numeric" autoComplete="off" placeholder="00000-000" pattern="[0-9]{5}-[0-9]{3}" maxLength={9} aria-describedby={`commercial-${name}-status`} />
    <p id={`commercial-${name}-status`} className="commercial-location__status" role="status" aria-live="polite">{message}</p>
    <Field id={`commercial-${name}-city`} name={name} label="Cidade e UF" required value={city} onChange={event => { setCity(event.target.value); setStatus(''); setAddress('') }} autoComplete="off" placeholder="Ex.: Recife · PE" />
    {status === 'error' && <button type="button" className="commercial-location__retry" onClick={() => setRetry(value => value + 1)}>Tentar consulta novamente</button>}
  </fieldset>
}

function RadioOptions({ name, legend, options }) {
  return <fieldset className="commercial-options">
    <legend>{legend}</legend>
    <div className="commercial-options__grid">{options.map(({ value, label, icon: Icon }) => <label key={value} className="commercial-options__item">
      <input type="radio" name={name} value={value} required />
      <span><Icon size={21} strokeWidth={1.6} aria-hidden="true" /><span>{label}</span></span>
    </label>)}</div>
  </fieldset>
}

export default function CommercialFields() {
  return <div className="commercial-fields">
    <div className="commercial-fields__locations"><CommercialLocation name="origin" label="Origem" /><CommercialLocation name="destination" label="Principal destino" /></div>
    <RadioOptions name="frequency" legend="Com que frequência sua empresa envia?" options={[
      { value: 'pontual', label: 'Envio pontual', icon: CalendarCheck },
      { value: 'semanal', label: 'Toda semana', icon: CalendarDays },
      { value: 'diaria', label: 'Todos os dias', icon: CalendarClock },
      { value: 'avaliar', label: 'Ainda não sei', icon: CircleHelp },
    ]} />
    <RadioOptions name="segment" legend="O que sua empresa vende?" options={[
      { value: 'industria', label: 'Produtos industriais', icon: Factory },
      { value: 'alimentos', label: 'Alimentos e bebidas', icon: ShoppingBasket },
      { value: 'moda', label: 'Moda e acessórios', icon: Shirt },
      { value: 'moveis', label: 'Móveis e decoração', icon: Armchair },
      { value: 'eletronicos', label: 'Eletrônicos', icon: Monitor },
      { value: 'outro', label: 'Outros produtos', icon: Package },
    ]} />
  </div>
}
