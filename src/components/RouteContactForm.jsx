import { readContactMemory } from '../utils/contactMemory.js'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button, Field } from './UI.jsx'

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 3) return digits ? `(${digits}` : ''
  const area = `(${digits.slice(0, 2)}) `
  const number = digits.slice(2)
  return area + (number.length > 5 ? `${number.slice(0, 5)}-${number.slice(5)}` : number)
}

export default function RouteContactForm({ selectedRoutes, extras, onEdit, editHref, onRemoveRoute, onRemoveExtra, onComplete }) {
  const navigate = useNavigate()
  const [phone, setPhone] = useState(() => readContactMemory().phone || '')
  const [status, setStatus] = useState('')
  const [errors, setErrors] = useState({})
  const count = selectedRoutes.length + extras.length
  const originNames = [...new Set([...selectedRoutes.map(route => route.origin), ...extras.map(item => item.origin)])]
  const summary = `${count} ${count === 1 ? 'destino' : 'destinos'}${originNames.length === 1 ? ` a partir de ${originNames[0]}` : ' em sua operação'}`
  const stateCounts = [...selectedRoutes.map(route => route.destinationUf), ...extras.map(item => item.destination.match(/(?:·|\s)([A-Z]{2})(?:\s|$)/)?.[1])].filter(Boolean).reduce((counts, uf) => ({ ...counts, [uf]: (counts[uf] || 0) + 1 }), {})
  const edit = onEdit
    ? <button type="button" onClick={onEdit} className="min-h-11 text-sm font-bold text-[var(--brand)] underline">Editar</button>
    : <Link to={editHref || '/rotas'} className="inline-flex min-h-11 items-center text-sm font-bold text-[var(--brand)] underline">Editar</Link>

  return <form noValidate className="route-contact route-contact-layout" onSubmit={event => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextErrors = {}
    if (!String(data.get('name') || '').trim()) nextErrors.name = 'Informe seu nome.'
    if (!String(data.get('organization') || '').trim()) nextErrors.organization = 'Informe sua empresa.'
    const email = String(data.get('email') || '').trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Informe um e-mail válido.'
    if (phone.replace(/\D/g, '').length < 10) nextErrors.phone = 'Informe um telefone com DDD.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { setStatus('Revise os campos indicados.'); window.setTimeout(() => document.getElementById(`route-contact-${Object.keys(nextErrors)[0]}`)?.focus(), 0); return }
    if (onComplete) { onComplete(Object.fromEntries(data.entries())); return }
    navigate('/obrigado/rotas', { state: { demo: true } })
  }}>
    <div className="route-contact-plan">
    {count > 0 && <div className="route-contact-plan__heading"><p className="text-sm font-semibold" aria-live="polite">{summary}</p>{edit}</div>}
    {count > 0 && <><p className="route-contact-summary">{Object.entries(stateCounts).map(([uf, total]) => `${uf}: ${total} ${total === 1 ? 'destino' : 'destinos'}`).join(' · ') || 'Destinos reunidos para esta operação.'}</p><details className="route-contact-destinations"><summary>Consultar {count} {count === 1 ? 'destino' : 'destinos'}</summary><ul className="route-contact-locations">
      {selectedRoutes.map(route => <li key={route.id}><span><strong>{route.origin}</strong> → {route.destination}</span>{onRemoveRoute && <button type="button" onClick={() => onRemoveRoute(route.id)} aria-label={`Remover ${route.destination}`}>Remover</button>}</li>)}
      {extras.map((item, index) => <li key={`${item.origin}-${item.destination}`}><span><strong>{item.origin}</strong> → {item.destination}</span>{onRemoveExtra && <button type="button" onClick={() => onRemoveExtra(index)} aria-label={`Remover ${item.destination}`}>Remover</button>}</li>)}
    </ul></details></>}
    </div>
    <div className="route-contact-fields">
    <Field id="route-contact-name" name="name" label="Nome" error={errors.name} autoComplete="name" placeholder="Seu nome completo" />
    <Field id="route-contact-organization" name="organization" label="Empresa" error={errors.organization} autoComplete="organization" placeholder="Nome da empresa" />
    <Field id="route-contact-email" name="email" label="E-mail" error={errors.email} type="email" autoComplete="email" inputMode="email" placeholder="voce@empresa.com.br" />
    <Field id="route-contact-phone" name="phone" label="WhatsApp" error={errors.phone} type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={event => setPhone(formatPhone(event.target.value))} placeholder="(XX) XXXXX-XXXX" />
    <details className="sm:col-span-2"><summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">Mais detalhes (opcional)</summary><div className="grid gap-4 sm:grid-cols-2">
    <Field id="route-contact-frequency" name="frequency" label="Frequência de embarques (opcional)" as="select" error={errors.frequency} options={[{ value: '', label: 'Selecione' }, { value: 'pontual', label: 'Pontual' }, { value: 'semanal', label: 'Semanal' }, { value: 'diaria', label: 'Diária' }]} />
    <Field id="route-contact-message" name="message" className="sm:col-span-2" label="Observações (opcional)" as="textarea" placeholder="Volume, perfil da carga e particularidades" />
    </div></details>
    <Button type="submit" className="sm:col-span-2">{onComplete ? 'Concluir planejamento' : 'Enviar para o comercial'} <ArrowRight size={17} /></Button>
    {status && <p className="rounded-lg bg-[var(--canvas)] p-3 text-sm leading-6 text-[var(--ink)] sm:col-span-2" role="status">{status}</p>}
    </div>
  </form>
}
