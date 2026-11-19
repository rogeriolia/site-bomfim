import { useEffect, useState } from 'react'
import { Field } from './UI.jsx'

const digits = value => value.replace(/\D/g, '').slice(0, 8)
const formatCep = value => digits(value).replace(/(\d{5})(\d)/, '$1-$2')

export default function CepCityFields({ prefix, title, testMode = false }) {
  const [cep, setCep] = useState(testMode ? (prefix === 'origin' ? '50000-000' : '58000-000') : '')
  const [city, setCity] = useState(testMode ? (prefix === 'origin' ? 'Recife · PE' : 'João Pessoa · PB') : '')
  const [status, setStatus] = useState('')
  const normalized = digits(cep)

  useEffect(() => {
    if (normalized.length !== 8) return undefined
    const controller = new AbortController()
    let active = true
    const timer = window.setTimeout(() => controller.abort(), 8000)
    setStatus('loading')
    fetch(`https://viacep.com.br/ws/${normalized}/json/`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Falha na consulta'); return response.json() })
      .then(data => {
        if (data.erro || !data.localidade || !data.uf) throw new Error('CEP não encontrado')
        if (active) { setCity(`${data.localidade} · ${data.uf}`); setStatus('success') }
      })
      .catch(() => { if (active) setStatus('error') })
      .finally(() => window.clearTimeout(timer))
    return () => { active = false; window.clearTimeout(timer); controller.abort() }
  }, [normalized])

  const statusText = status === 'loading' ? 'Buscando cidade…' : status === 'success' ? 'Cidade preenchida. Você pode corrigir se necessário.' : status === 'error' ? 'Não localizamos este CEP. Digite a cidade manualmente.' : 'Digite o CEP para preencher a cidade automaticamente.'

  return <fieldset className="conversion-form__location">
    <legend>{title}</legend>
    <Field id={`cv-${prefix}-cep`} name={`${prefix}Cep`} label="CEP" value={cep} onChange={event => { setCep(formatCep(event.target.value)); setCity(''); setStatus('') }} inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" maxLength={9} />
    <Field id={`cv-${prefix}-city`} name={prefix} label="Cidade e UF" value={city} onChange={event => { setCity(event.target.value); setStatus('') }} autoComplete="address-level2" required placeholder={prefix === 'origin' ? 'Ex.: Recife · PE' : 'Ex.: João Pessoa · PB'} />
    <p className={`conversion-form__cep-status ${status === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">{statusText}</p>
  </fieldset>
}
