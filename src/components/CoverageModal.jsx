import { useEffect, useMemo, useState } from 'react'
import { Search, MapPinned, Building2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchUnits } from '../utils/unitsApi.js'
import { Dialog } from './UI.jsx'

const policy = { standard: 'Atendimento padrão', exception: 'Avaliação comercial para clientes antigos' }
const prettyCity = value => String(value).toLocaleLowerCase('pt-BR').replace(/(^|[\s'-])\p{L}/gu, letter => letter.toLocaleUpperCase('pt-BR'))
const unitNames = { MCZ: 'Maceió', FST: 'Feira de Santana', SSA: 'Salvador', AJU: 'Aracaju', FOR: 'Fortaleza', REC: 'Recife', JPA: 'João Pessoa', NAT: 'Natal' }

export default function CoverageModal({ triggerLabel = 'Consultar cobertura' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cities, setCities] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingUnits, setLoadingUnits] = useState(false)

  useEffect(() => {
    if (!open || cities.length) return
    setLoading(true)
    const controller = new AbortController()
    import('../../public/data/bomfim-cities.json').then(({ default: data }) => { if (!controller.signal.aborted) setCities(data.cities || []) }).catch(() => { if (!controller.signal.aborted) setCities([]) }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [open, cities.length])

  useEffect(() => {
    if (!open || units.length) return
    let active = true
    setLoadingUnits(true)
    fetchUnits()
      .then(list => { if (active) setUnits(list) })
      .catch(() => { if (active) setUnits([]) })
      .finally(() => { if (active) setLoadingUnits(false) })
    return () => { active = false }
  }, [open, units.length])

  const matches = useMemo(() => {
    const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
    const term = normalize(query.trim())
    if (!term) return []
    const cep = query.replace(/\D/g, '')
    const found = cities.filter(item => cep.length === 8 ? Number(cep) >= Number(item.cepFrom) && Number(cep) <= Number(item.cepTo) : /^[a-z]{2}$/.test(term) ? normalize(item.uf) === term : normalize(`${item.city} ${item.uf}`).includes(term))
    const unique = new Map()
    for (const item of found) {
      const key = `${item.city}-${item.uf}-${item.unit}`
      if (!unique.has(key)) unique.set(key, item)
    }
    return [...unique.values()].slice(0, 10)
  }, [cities, query])

  return <>
    <button type="button" className="coverage-trigger" onClick={() => setOpen(true)}><MapPinned size={16} aria-hidden="true" />{triggerLabel}</button>
    <Dialog open={open} onClose={() => setOpen(false)} titleId="coverage-dialog-title" className="coverage-dialog">
      <p className="eyebrow">Cobertura Bomfim</p><h2 id="coverage-dialog-title" className="heading mt-2 pr-10 text-2xl">Sua cidade está na rota?</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">Pesquise uma cidade, CEP ou estado na base com mais de 14 mil combinações de origem e destino. A cobertura padrão contempla 7 estados do Nordeste; Maranhão e Piauí passam por avaliação comercial.</p>
      <div className="coverage-dialog__layout">
        <section className="coverage-dialog__search-panel" aria-label="Buscar cobertura">
          <label htmlFor="coverage-search" className="field-label mt-6">Cidade, CEP ou UF</label><div className="coverage-search"><Search size={18} aria-hidden="true" /><input id="coverage-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ex.: Caruaru, 55000-001 ou PE" autoFocus /></div>
          <div className="coverage-results" aria-live="polite">{loading && <p>Carregando a base de cidades…</p>}{!loading && query && !matches.length && <p>Nenhuma cidade encontrada. Confira o nome ou CEP.</p>}{matches.map(item => <div className="coverage-result" key={`${item.uf}-${item.city}-${item.unit}`}><div><strong>{prettyCity(item.city)} · {item.uf}</strong><small>{query.replace(/\D/g, '').length === 8 ? `CEP ${item.cepFrom} a ${item.cepTo} · ` : ''}Unidade {unitNames[item.unit] || item.unit}</small></div><span className={item.availability === 'exception' ? 'is-exception' : ''}>{policy[item.availability]}</span></div>)}{!query && !loading && <p>Digite uma cidade, CEP ou UF para consultar a cobertura.</p>}{query && matches.length === 10 && <p className="coverage-results__hint">Mostrando até 10 resultados. Refine a busca para encontrar uma cidade específica.</p>}</div>
          <p className="mt-5 text-xs leading-5 text-[var(--muted)]">A consulta orienta a descoberta. A confirmação final considera endereço, carga, janela de recebimento e condições comerciais.</p>
        </section>
        <aside className="coverage-dialog__sidebar" aria-label="Unidades Bomfim"><div className="coverage-dialog__sidebar-heading"><Building2 size={18} aria-hidden="true"/><div><strong>{loadingUnits ? '…' : units.length} unidades no Nordeste</strong><span>Estrutura para atender sua operação</span></div></div><ul>{loadingUnits && !units.length && <li><span>Carregando unidades…</span></li>}{units.map(unit => <li key={`${unit.uf}-${unit.code}`}><span>{unit.name}</span><small>{unit.state}</small></li>)}</ul><Link to="/unidades" onClick={() => setOpen(false)}>Endereços e telefones <ArrowRight size={15} aria-hidden="true" /></Link><Link to="/rotas/planejar" onClick={() => setOpen(false)}>Planejar uma rota <ArrowRight size={15} aria-hidden="true" /></Link></aside>
      </div>
    </Dialog>
  </>
}
