import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'

const regions = [
  { uf: 'AL', name: 'Alagoas' }, { uf: 'BA', name: 'Bahia' }, { uf: 'CE', name: 'Ceará' }, { uf: 'PB', name: 'Paraíba' }, { uf: 'PE', name: 'Pernambuco' }, { uf: 'RN', name: 'Rio Grande do Norte' }, { uf: 'SE', name: 'Sergipe' }, { uf: 'MA', name: 'Maranhão', exception: true }, { uf: 'PI', name: 'Piauí', exception: true },
]
const popular = {
  AL: ['MACEIO','ARAPIRACA','RIO LARGO','PALMEIRA DOS INDIOS'],
  BA: ['SALVADOR','FEIRA DE SANTANA','VITORIA DA CONQUISTA','JUAZEIRO','ITABUNA','BARREIRAS'],
  CE: ['FORTALEZA','JUAZEIRO DO NORTE','SOBRAL','CAUCAIA','MARACANAU','CRATO'],
  PB: ['JOAO PESSOA','CAMPINA GRANDE','SANTA RITA','PATOS','CABEDELO','SOUSA'],
  PE: ['RECIFE','JABOATAO DOS GUARARAPES','CARUARU','PETROLINA','OLINDA','GARANHUNS'],
  RN: ['NATAL','MOSSORO','PARNAMIRIM','SAO GONCALO DO AMARANTE','CAICO'],
  SE: ['ARACAJU','ITABAIANA','ESTANCIA','LAGARTO','NOSSA SENHORA DO SOCORRO'],
  MA: ['SAO LUIS','IMPERATRIZ','CAXIAS','TIMON'],
  PI: ['TERESINA','PARNAIBA','PICOS','FLORIANO'],
}
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleUpperCase('pt-BR').trim()
const maskCep = value => value.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
const testCeps = { origin: '50030230', destination: '58010000' }
const prettyCity = value => String(value || '').toLocaleLowerCase('pt-BR').replace(/(^|[\s'-])\p{L}/gu, letter => letter.toLocaleUpperCase('pt-BR'))

export default function RouteRegionPicker({ prefix, selection, onChange, testMode = false }) {
  const [cities, setCities] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [cep, setCep] = useState(selection?.cep || '')
  useEffect(() => { let active = true; import('../../public/data/bomfim-cities.json').then(({ default: data }) => { if (active) setCities(data.cities || []) }); return () => { active = false } }, [])
  const cityRows = useMemo(() => {
    const unique = new Map()
    for (const item of cities) {
      const key = `${item.uf}|${normalize(item.city)}`
      const existing = unique.get(key)
      if (!existing || (existing.availability === 'exception' && item.availability === 'standard')) unique.set(key, item)
    }
    return [...unique.values()]
  }, [cities])
  useEffect(() => {
    if (!testMode || !cityRows.length) return
    const testCep = testCeps[prefix]
    const item = cities.find(value => Number(testCep) >= Number(value.cepFrom) && Number(testCep) <= Number(value.cepTo))
    if (!item) { setStatus('O CEP de teste não consta na base.'); return }
    const key = `bomfim:test-coverage:${prefix}:${testCep}`
    setCep(maskCep(testCep)); setSelectionIfEmpty(item, testCep); setStatus(`Atendemos ${prettyCity(item.city)} · ${item.uf}. CEP real usado para validar a cobertura.`)
    if (!sessionStorage.getItem(key)) { sessionStorage.setItem(key, '1'); void markCoverage({ cep: testCep, city: item.city, uf: item.uf }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testMode, cityRows.length, prefix])
  function setSelectionIfEmpty(item, cepValue = '') {
    if (!selection?.city || selection.uf !== item.uf) onChange({ city: item.city, uf: item.uf, ibge: item.ibge, unitCode: item.unit, availability: item.availability, cep: cepValue })
  }
  async function markCoverage(queryValue) {
    try {
      const consent = JSON.parse(localStorage.getItem('bomfim:consent:v2') || 'null')
      const sessionId = consent?.analytics === true ? sessionStorage.getItem('bomfim:analytics-session') : null
      const response = await fetch(`${import.meta.env.BASE_URL}api/coverage-check.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...queryValue, path: window.location.pathname, sessionId }), credentials: 'same-origin' })
      return response.ok ? await response.json() : null
    } catch { return null }
  }
  const regionCities = cityRows.filter(item => item.uf === selection?.uf)
  const popularCities = (popular[selection?.uf] || []).map(name => regionCities.find(item => normalize(item.city) === name)).filter(Boolean)
  const filteredCities = useMemo(() => {
    if (query.trim().length < 2) return []
    const term = normalize(query)
    const numbers = query.replace(/\D/g, '')
    if (numbers.length >= 5) {
      const matches = cities.filter(item => numbers.length === 8 ? Number(numbers) >= Number(item.cepFrom) && Number(numbers) <= Number(item.cepTo) : item.cepFrom.startsWith(numbers))
      return matches.filter(item => !selection?.uf || item.uf === selection.uf).slice(0, 8)
    }
    return regionCities.filter(item => normalize(item.city).includes(term)).slice(0, 8)
  }, [query, cities, regionCities, selection?.uf])
  function selectCity(item, cepValue = '') {
    setStatus(item.availability === 'exception' ? `${prettyCity(item.city)} · ${item.uf} precisa de avaliação comercial. A equipe confirma as condições.` : `Atendemos ${prettyCity(item.city)} · ${item.uf}. O time confirma o CEP e os detalhes da rota.`)
    onChange({ city: item.city, uf: item.uf, ibge: item.ibge, unitCode: item.unit, availability: item.availability, cep: cepValue })
    setCep(cepValue ? maskCep(cepValue) : '')
    setQuery('')
    void markCoverage(cepValue ? { cep: cepValue, city: item.city, uf: item.uf } : { city: item.city, uf: item.uf })
  }
  async function checkCep(event) {
    event.preventDefault()
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) { setStatus('Digite um CEP com 8 números.'); return }
    setStatus('Consultando o CEP…')
    try {
      const addressResponse = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const address = await addressResponse.json()
      if (!addressResponse.ok || address.erro) throw Error('CEP não localizado. Confira os números.')
      const item = cities.find(value => Number(value.ibge) === Number(address.ibge) && Number(digits) >= Number(value.cepFrom) && Number(digits) <= Number(value.cepTo))
      const verification = await markCoverage({ cep: digits, city: address.localidade, uf: address.uf })
      if (!item || verification?.status === 'not_covered') { onChange({ city: address.localidade, uf: address.uf, availability: 'not_covered', cep: digits }); setStatus(`Ainda não atendemos esse CEP em ${prettyCity(address.localidade)} · ${address.uf}. Deixe seu contato para avaliarmos outras opções.`); return }
      const selected = { ...item, availability: verification?.status === 'conditional' ? 'exception' : item.availability }
      selectCity(selected, digits)
    } catch (error) { if (digits.length === 8) void markCoverage({ cep: digits }); setStatus(error.message || 'Não foi possível consultar. Tente novamente.') }
  }
  const isSelected = item => selection?.ibge === item.ibge
  return <section className="route-region-picker" aria-labelledby={`${prefix}-region-title`}>
    <div className="route-region-picker__heading"><h3 id={`${prefix}-region-title`}>{prefix === 'origin' ? 'De onde sai a carga?' : 'Para onde vai?'}</h3>{selection?.city && <span className="route-region-picker__selected">{prettyCity(selection.city)} · {selection.uf}</span>}</div>
    <label className="field-label" htmlFor={`${prefix}-uf`}>{prefix === 'origin' ? 'Estado de origem' : 'Estado de destino'}</label>
    <select className="field" id={`${prefix}-uf`} value={selection?.uf || ''} onChange={event => { onChange(event.target.value ? { uf: event.target.value } : {}); setStatus(''); const region = regions.find(item => item.uf === event.target.value); if (region) setStatus(region.exception ? 'Atendimento nesta região depende de avaliação comercial.' : 'Escolha uma cidade atendida nesta região.') }}>
      <option value="">Escolha um estado</option>{regions.map(region => <option key={region.uf} value={region.uf}>{region.name}{region.exception ? ' · sob avaliação comercial' : ''}</option>)}
    </select>
    {selection?.uf && <>
      <p className="route-region-picker__subheading">Cidades principais</p>
      {popularCities.length > 0 ? <div className="route-region-picker__city-columns">{popularCities.map(item => <button type="button" key={`${item.uf}-${item.ibge}`} className={isSelected(item) ? 'is-selected' : ''} onClick={() => selectCity(item)}>{prettyCity(item.city)}</button>)}</div> : <p className="route-region-picker__status">Selecione uma cidade na busca abaixo.</p>}
      <label className="field-label route-region-picker__other-label" htmlFor={`${prefix}-city-search`}>Outros municípios ou CEP</label>
      <div className="route-region-picker__search"><Search size={17} aria-hidden="true"/><input id={`${prefix}-city-search`} value={query} onChange={event => setQuery(event.target.value)} placeholder="Digite o nome ou o CEP" autoComplete="off" /></div>
      {filteredCities.length > 0 && <ul className="route-region-picker__results">{filteredCities.map((item, index) => <li key={`${item.uf}-${item.ibge}-${item.unit}-${index}`}><button type="button" onClick={() => selectCity(item, query.replace(/\D/g, '').length === 8 ? query.replace(/\D/g, '') : '')}>{prettyCity(item.city)} · {item.uf} <span>{item.availability === 'exception' ? 'Sob avaliação' : `Unidade ${item.unit}`}</span></button></li>)}</ul>}
      <div className="route-region-picker__cep" role="group" aria-label="Consultar CEP"><label className="field-label" htmlFor={`${prefix}-cep`}>Ou confira um CEP específico</label><div><input id={`${prefix}-cep`} className="field" value={cep} onChange={event => setCep(maskCep(event.target.value))} inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" maxLength={9} /><button type="button" onClick={checkCep}>Conferir</button></div></div>
      {status && <p className={`route-region-picker__status ${selection?.availability === 'exception' || selection?.availability === 'not_covered' ? 'is-warning' : ''}`} role="status">{status}</p>}
    </>}
  </section>
}
