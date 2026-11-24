import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { Button, Field } from './UI.jsx'
import RouteContactForm from './RouteContactForm.jsx'
import FileDropzone from './FileDropzone.jsx'
import StateFlag from './StateFlag.jsx'
import '../styles/cep-planner.css'
import cityData from '../../public/data/bomfim-cities.json'

const clean = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const cepMask = value => value.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
const steps = ['Origem', 'Destinos', 'Sua carga', 'Revisão', 'Seu contato']
const packagingOptions = [['caixa', 'Caixa'], ['fardo', 'Fardo'], ['rolo', 'Rolo'], ['engradado', 'Engradado'], ['outro', 'Outro']]
const numberValue = value => Number(String(value).replace(',', '.')) || 0
const originUnits = { PE: 'JABOATAO DOS GUARARAPES', CE: 'EUSEBIO', RN: 'PARNAMIRIM', PB: 'JOAO PESSOA', AL: 'MACEIO', SE: 'ARACAJU', BA: 'SIMOES FILHO' }
export default function CepRoutePlanner() {
  const [step, setStep] = useState(0)
  const [cities] = useState(cityData.cities)
  const [routes, setRoutes] = useState([])
  const [origin, setOrigin] = useState(null)
  const [destinations, setDestinations] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [routeStatus, setRouteStatus] = useState('loading')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [cargo, setCargo] = useState({ product: '', productType: '', packaging: '', value: '', frequency: '', reference: '', notes: '' })
  const [volumes, setVolumes] = useState([{ height: '', width: '', length: '', weight: '', quantity: '' }])
  const [attachment, setAttachment] = useState(null)
  const cargoForm = useRef(null)
  const totals = volumes.reduce((sum, volume) => ({ count: sum.count + numberValue(volume.quantity), weight: sum.weight + numberValue(volume.quantity) * numberValue(volume.weight), cubage: sum.cubage + numberValue(volume.height) * numberValue(volume.width) * numberValue(volume.length) * numberValue(volume.quantity) / 1000000 }), { count: 0, weight: 0, cubage: 0 })
  const formatNumber = value => value.toLocaleString('pt-BR', { maximumFractionDigits: 3 })
  const updateCargo = event => setCargo(previous => ({ ...previous, [event.target.name]: event.target.value }))
  const advance = () => { if (step === 2 && !cargoForm.current?.reportValidity()) return; changeStep(step + 1) }
  const headingRef = useRef(null)
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }) }, [step, completed])
  const complete = contact => {
    const plan = { origin, destinations, cargo, volumes, totals, attachmentName: attachment?.name || null, contact, createdAt: new Date().toISOString() }
    try { sessionStorage.setItem('bomfim-completed-plan', JSON.stringify(plan)) } catch { /* Completion remains available if storage is disabled. */ }
    setCompleted(true)
  }
  const downloadPlan = () => {
    const text = ['Planejamento de rotas Bomfim', `Origem: ${origin.city} · ${origin.uf} ${origin.cep || ''}`, ...destinations.map(d => `${d.city} · ${d.uf} ${d.cep || ''} — ${facts(d)}`), `Produto: ${cargo.product}`, `Tipo de produto: ${cargo.productType}`, `Embalagem: ${cargo.packaging}`, `Volumes: ${totals.count}`, `Peso total: ${formatNumber(totals.weight)} kg`, `Peso médio por volume: ${formatNumber(totals.count ? totals.weight / totals.count : 0)} kg`, `Cubagem: ${formatNumber(totals.cubage)} m³`, `Valor: R$ ${cargo.value}`, `Frequência: ${cargo.frequency}`, `Referência: ${cargo.reference}`, ...volumes.map((v, index) => `Grupo ${index + 1}: ${v.quantity} volumes, ${v.length} × ${v.width} × ${v.height} cm, ${v.weight} kg por volume`), `Observações: ${cargo.notes}`, `Anexo selecionado: ${attachment?.name || 'Nenhum'} (não transmitido)`].join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'minhas-rotas-bomfim.txt'; anchor.click(); URL.revokeObjectURL(url)
  }
  useEffect(() => {
    const controller = new AbortController()
    import('../data/route-times.json').then(({ default: data }) => { if (!controller.signal.aborted) { setRoutes(data.rows.map(([originIndex, destinationIbge, distanceKm, leadTimeBusinessDays]) => ({ originIbge: data.origins[originIndex][0], origin: data.origins[originIndex][1], destinationIbge, distanceKm, leadTimeBusinessDays }))); setRouteStatus('ready') } }).catch(() => { if (!controller.signal.aborted) setRouteStatus('error') })
    return () => controller.abort()
  }, [])
  const findRoute = city => {
    if (!origin) return null
    const candidates = routes.filter(r => Number(r.destinationIbge) === Number(city.ibge))
    return candidates.find(r => Number(r.originIbge) === Number(origin.ibge)) || candidates.find(r => clean(r.origin) === clean(originUnits[origin.uf])) || null
  }
  const select = city => {
    if (city.availability === 'exception') { setStatus('Para MA e PI, fale com o comercial sobre as condições do seu contrato.'); return }
    if (!step) { setOrigin(city); setResult(null); setQuery(''); setStatus(''); setDestinations([]); setStep(1); return }
    if (destinations.some(d => d.ibge === city.ibge && d.cep === city.cep)) { setStatus('Este destino já foi adicionado.'); return }
    setDestinations(previous => [...previous, { ...city, route: findRoute(city) }]); setQuery(''); setResult(null); setStatus('Destino adicionado. Você pode buscar outro CEP.')
  }
  const search = async event => {
    event.preventDefault()
    const cep = query.replace(/\D/g, '')
    if (!/^\d/.test(query.trim())) {
      const exact = cities.find(city => clean(`${city.city}`).trim() === clean(query).trim() || clean(`${city.city} ${city.uf}`).trim() === clean(query).trim())
      if (exact) { select(exact); return }
      setStatus(matches.length ? 'Escolha uma cidade nos resultados abaixo.' : 'Cidade não encontrada. Tente o nome sem a UF ou informe um CEP.'); return
    }
    if (cep.length !== 8) { setStatus('Informe um CEP com 8 números ou escolha uma cidade nos resultados.'); return }
    setBusy(true); setResult(null); setStatus('Localizando o endereço…')
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const address = await response.json()
      if (!response.ok || address.erro) throw Error('CEP não encontrado. Confira os números.')
      const city = cities.find(c => Number(c.ibge) === Number(address.ibge) && cep >= c.cepFrom && cep <= c.cepTo)
      if (!city) throw Error('Este CEP não consta na cobertura cadastrada da Bomfim.')
      setResult({ ...city, cep: cepMask(cep), street: address.logradouro, neighborhood: address.bairro }); setStatus('Endereço localizado. Confira e confirme abaixo.')
    } catch (error) { setStatus(error.message || 'Não foi possível consultar o CEP.') } finally { setBusy(false) }
  }
  const matches = query.length >= 2 && !/^\d/.test(query) ? cities.filter(c => clean(`${c.city} ${c.uf}`).includes(clean(query))).slice(0, 8) : []
  const remove = index => setDestinations(previous => previous.filter((_, i) => i !== index))
  const changeStep = next => { setStep(next); setQuery(''); setResult(null); setStatus('') }
  const facts = city => { const route = findRoute(city); return route ? `${route.distanceKm == null ? 'Distância não cadastrada' : `${route.distanceKm.toLocaleString('pt-BR')} km`} · Prazo médio de entrega: ${route.leadTimeBusinessDays == null ? 'não cadastrado' : `${route.leadTimeBusinessDays} ${route.leadTimeBusinessDays === 1 ? 'dia útil' : 'dias úteis'}`}` : routeStatus === 'loading' ? 'Carregando distância e prazo…' : routeStatus === 'error' ? 'Prazos indisponíveis no momento' : 'Prazo não cadastrado para esta origem' }
  const capitals = ['RECIFE', 'SALVADOR', 'FORTALEZA', 'JOAO PESSOA', 'MACEIO', 'NATAL', 'ARACAJU'].map(name => cities.find(city => clean(city.city) === clean(name))).filter(Boolean)
  return <main className="cep-planner" data-ui>
    <aside className="cep-planner__sidebar"><Link to="/rotas"><img className="logo-white" src="/assets/brand/bomfim-cargas.webp" alt="Bomfim Cargas" /></Link><p>Planejador de rotas</p><nav aria-label="Etapas do planejamento">{steps.map((title, index) => <button key={title} type="button" disabled={index > step} onClick={() => changeStep(index)} aria-current={index === step ? 'step' : undefined}><span>{index < step ? <Check size={18}/> : index + 1}</span><strong>{title}</strong></button>)}</nav><div className="cep-planner__help"><p>Planeje a partir do endereço da sua carga.</p><Link to="/comercial">Falar com a Bomfim →</Link></div></aside>
    <section className="cep-planner__workspace"><header><span className="cep-planner__step-title">{completed ? 'Planejamento concluído' : ['Origem da carga', 'Destinos da operação', 'Perfil da carga', 'Revisão do planejamento', 'Seus dados de contato'][step]}</span><Link to="/rotas">Voltar ao site</Link></header><div className={`cep-planner__content ${step === 1 && !completed ? 'cep-planner__content--destinations' : ''}`}><h1 className="visually-hidden" ref={headingRef} tabIndex={-1}>{completed ? 'Seu planejamento está pronto.' : ['De onde sua carga sai?', 'Para onde sua carga vai?', 'Qual é o perfil da carga?', 'Confira seu planejamento', 'Converse com a Bomfim'][step]}</h1><p className="cep-planner__intro">{completed ? 'As rotas foram organizadas. Baixe o resumo para continuar a conversa com a equipe Bomfim.' : ['Informe o CEP da coleta. Também é possível buscar pelo nome da cidade.', 'Busque o CEP de entrega e adicione quantos destinos precisar.', 'Informe produtos, embalagens, medidas e frequência para planejar o transporte.', 'Revise seus destinos e os dados da carga.', 'Confira seus dados para concluir o planejamento.'][step]}</p>
    {origin && !completed && (step === 1 || step === 3) && <div className="cep-planner__origin-summary"><div><span>Origem da carga</span><strong><StateFlag uf={origin.uf}/>{origin.city} · {origin.uf}</strong>{origin.cep && <small>CEP {origin.cep}</small>}</div><button type="button" onClick={() => changeStep(0)}>Alterar origem</button></div>}
    {step < 2 && <>
      <form className="cep-planner__search" onSubmit={search}>
        <label htmlFor="planner-cep">{step ? 'CEP ou cidade de destino' : 'CEP ou cidade de origem'}</label>
        <div><input id="planner-cep" value={query} autoComplete="off" placeholder="Ex.: Recife, Salvador ou 50030-230" onChange={event => { const value = event.target.value; setQuery(/^\d/.test(value) ? cepMask(value) : value); setResult(null); setStatus('') }}/><Button type="submit" disabled={busy || !query.trim()}>{busy ? 'Buscando…' : /^\d/.test(query) ? 'Buscar CEP' : 'Buscar cidade'}</Button></div>
      </form>
      {!query && <section className="cep-planner__capitals"><h2>Capitais atendidas</h2><p>Escolha uma capital ou digite outra cidade da base Bomfim.</p><div>{capitals.filter(city => step === 0 || city.ibge !== origin?.ibge).map(city => <button key={city.ibge} type="button" onClick={() => select(city)}><StateFlag uf={city.uf}/>{city.city} <span>· {city.uf}</span><ArrowRight size={16}/></button>)}</div></section>}
      {status && <p className="cep-planner__status" role="status">{status}</p>}
      {result && <div className="cep-planner__address"><strong><StateFlag uf={result.uf}/>{result.city} · {result.uf}</strong><p>{[result.street, result.neighborhood, result.cep].filter(Boolean).join(' · ')}</p>{step === 1 && <p>{facts(result)}</p>}<Button onClick={() => select(result)}>{step ? 'Adicionar destino' : 'Usar esta origem'} <ArrowRight size={16}/></Button></div>}
      {matches.length > 0 && <ul className="cep-planner__results" aria-label="Cidades encontradas">{matches.map((city, index) => <li key={`${city.ibge}-${index}`}><button type="button" onClick={() => select(city)}><span><strong><StateFlag uf={city.uf}/>{city.city} · {city.uf}</strong><small>{city.availability === 'exception' ? 'Atendimento conforme contrato existente' : step ? facts(city) : `CEP ${cepMask(city.cepFrom)} a ${cepMask(city.cepTo)}`}</small></span><ArrowRight size={18}/></button></li>)}</ul>}
    </>}
    {(step === 1 || step === 3) && <section className="cep-planner__selected"><h2>Seus destinos <span>{destinations.length}</span></h2>{destinations.length ? <ul>{destinations.map((city, index) => <li key={`${city.ibge}-${index}`}><div><strong><StateFlag uf={city.uf}/>{city.city} · {city.uf}</strong>{city.cep && <p>{[city.street, city.cep].filter(Boolean).join(' · ')}</p>}<small>{facts(city)}</small></div><button type="button" onClick={() => remove(index)} aria-label={`Remover ${city.city}`}><X size={18}/></button></li>)}</ul> : <p>Os endereços adicionados aparecerão aqui.</p>}<p className="cep-planner__footnote">Distâncias e prazos são referências da base operacional, contadas em dias úteis. Quando o trecho parte da unidade responsável, o prazo não inclui uma nova estimativa de coleta no endereço.</p></section>}
    {step === 2 && <form ref={cargoForm} className="planner-cargo" onSubmit={event => { event.preventDefault(); advance() }}>
      <div className="planner-cargo__grid"><Field id="plan-product" name="product" label="O que será transportado?" value={cargo.product} onChange={updateCargo} required placeholder="Descreva os produtos"/><Field id="plan-product-type" name="productType" label="Tipo de produto" as="select" value={cargo.productType} onChange={updateCargo} required options={[{ value: '', label: 'Selecione' }, ...['Produtos industriais', 'Varejo', 'Alimentos e bebidas', 'E-commerce', 'Outro'].map(value => ({ value, label: value }))]}/><Field id="plan-value" name="value" label="Valor da mercadoria (R$)" inputMode="numeric" value={cargo.value} onChange={event => { const digits = event.target.value.replace(/\D/g, ''); setCargo(previous => ({ ...previous, value: digits ? (Number(digits) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '' })) }} required placeholder="0,00"/><Field id="plan-frequency" name="frequency" label="Frequência dos embarques" as="select" value={cargo.frequency} onChange={updateCargo} required options={[{ value: '', label: 'Selecione' }, ...['Pontual', 'Diária', 'Semanal', 'Mensal', 'A definir'].map(value => ({ value, label: value }))]}/></div>
      <fieldset className="quote-wizard__packaging"><legend>Tipo de embalagem</legend><div className="quote-wizard__packaging-options">{packagingOptions.map(([value, label]) => <label key={value} className={cargo.packaging === value ? 'is-selected' : ''}><input type="radio" name="packaging" value={value} checked={cargo.packaging === value} onChange={updateCargo} required/><img src={`${import.meta.env.BASE_URL}assets/quote/packaging/${value}.webp`} alt=""/><span>{label}</span></label>)}</div></fieldset>
      <section><h2>Medidas, peso e volumes</h2><p>Informe as medidas externas em centímetros e o peso médio de cada volume do grupo. Adicione outro grupo para tamanhos ou pesos diferentes.</p>{volumes.map((volume, index) => <div className="planner-cargo__volume" key={index}><strong>Grupo {index + 1}</strong><div className="planner-cargo__grid">{[['length', 'Comprimento (cm)'], ['width', 'Largura (cm)'], ['height', 'Altura (cm)'], ['weight', 'Peso por volume (kg)'], ['quantity', 'Quantidade de volumes']].map(([key, label]) => <Field key={key} id={`plan-volume-${index}-${key}`} label={label} type="number" inputMode={key === 'quantity' ? 'numeric' : 'decimal'} min={key === 'quantity' ? '1' : '0.001'} step={key === 'quantity' ? '1' : 'any'} required value={volume[key]} onChange={event => setVolumes(previous => previous.map((v, i) => i === index ? { ...v, [key]: event.target.value } : v))}/>)}</div>{volumes.length > 1 && <button type="button" onClick={() => setVolumes(previous => previous.filter((_, i) => i !== index))}>Remover grupo</button>}</div>)}<Button variant="outline" onClick={() => setVolumes(previous => [...previous, { height: '', width: '', length: '', weight: '', quantity: '' }])}>Adicionar grupo de volumes</Button><div className="planner-cargo__totals"><span>Volumes <strong>{totals.count}</strong></span><span>Peso total <strong>{formatNumber(totals.weight)} kg</strong></span><span>Peso médio <strong>{formatNumber(totals.count ? totals.weight / totals.count : 0)} kg/volume</strong></span><span>Cubagem <strong>{formatNumber(totals.cubage)} m³</strong></span></div></section>
      <Field id="plan-reference" name="reference" label="Pedido ou nota fiscal (opcional)" value={cargo.reference} onChange={updateCargo}/><Field id="plan-notes" name="notes" label="Observações sobre a operação (opcional)" as="textarea" value={cargo.notes} onChange={updateCargo}/><FileDropzone file={attachment} onChange={setAttachment}/><p className="cep-planner__footnote">O arquivo fica selecionado nesta sessão; anexos ainda não são transmitidos.</p>
    </form>}
    {step === 3 && <section className="planner-cargo"><h2>Perfil da carga <button type="button" onClick={() => changeStep(2)}>Editar carga</button></h2><p>{cargo.product} · {cargo.productType} · {cargo.packaging}</p><div className="planner-cargo__totals"><span>Volumes <strong>{totals.count}</strong></span><span>Peso total <strong>{formatNumber(totals.weight)} kg</strong></span><span>Peso médio <strong>{formatNumber(totals.count ? totals.weight / totals.count : 0)} kg/volume</strong></span><span>Cubagem <strong>{formatNumber(totals.cubage)} m³</strong></span></div><p>Valor: R$ {cargo.value} · Frequência: {cargo.frequency}</p>{cargo.notes && <p>{cargo.notes}</p>}{attachment && <p>Anexo selecionado: {attachment.name}</p>}</section>}
    {step === 4 && !completed && <RouteContactForm selectedRoutes={[]} extras={destinations.map(d => ({ origin: `${origin.city} · ${origin.cep || origin.uf}`, destination: `${d.city} · ${d.cep || d.uf}` }))} onEdit={() => changeStep(3)} onRemoveExtra={remove} onComplete={complete}/>}
    {completed && <section className="cep-planner__success" aria-label="Planejamento concluído"><div className="cep-planner__success-mark"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="35"/><path d="m23 41 11 11 23-25"/></svg></div><h2>{destinations.length} {destinations.length === 1 ? 'destino organizado' : 'destinos organizados'}</h2><p>Saída de {origin.city} · {origin.uf}</p><p>Planejamento concluído neste navegador. O envio ao comercial ainda não está disponível.</p><div><Button onClick={downloadPlan}>Baixar minhas rotas <ArrowRight size={16}/></Button><Button variant="outline" onClick={() => { setCompleted(false); changeStep(2) }}>Revisar planejamento</Button></div><Link to="/comercial">Continuar com o comercial →</Link></section>}
    </div>{step < 4 && <footer><button type="button" onClick={() => step ? changeStep(step - 1) : null} disabled={!step}><ArrowLeft size={17}/>Voltar</button><span>{destinations.length} destinos adicionados</span><Button disabled={!destinations.length || !step} onClick={advance}>{['Continuar', 'Informar carga', 'Revisar planejamento', 'Continuar para contato'][step]}<ArrowRight size={17}/></Button></footer>}</section>
  </main>
}
