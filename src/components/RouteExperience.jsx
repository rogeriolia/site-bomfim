import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import routes from '../data/routes.json'
import { Chip } from './UI.jsx'

export function RouteCard({ route, onPreview }) {
  return <article className="surface flex h-full flex-col p-5 transition-colors hover:border-[#cbd2dc]">
    <div className="flex items-start justify-between gap-3"><h3 className="text-lg font-extrabold leading-tight">{route.origin} <span aria-label="para">→</span> {route.destination}</h3><span className="shrink-0 text-xs text-[var(--muted)]">{route.distance}</span></div>
    <div className="mt-5 border-t border-[var(--line)] pt-4"><span className="block text-xs text-[var(--muted)]">Prazo de referência</span><strong className="mt-1 block text-lg">{route.leadTime}</strong></div>
    <div className="mt-4 flex flex-wrap gap-1.5">{route.segments.map(segment => <Chip key={segment}>{segment}</Chip>)}</div>
    {onPreview ? <button type="button" onClick={() => onPreview(route)} className="mt-5 inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-[var(--brand)] hover:underline">Ver corredor <ArrowRight size={16} /></button> : <Link to={`/rotas/${route.id}`} className="mt-5 inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-[var(--brand)] hover:underline">Ver corredor <ArrowRight size={16} /></Link>}
  </article>
}

export function RouteList({ limit = 3 }) {
  return <div><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold">Corredores para começar a explorar</p><Link to="/rotas/planejar" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">Planejar minhas rotas <ArrowRight size={17} /></Link></div><div className="grid gap-3 lg:grid-cols-3">{routes.slice(0, limit).map(route => <RouteCard key={route.id} route={route} />)}</div></div>
}
