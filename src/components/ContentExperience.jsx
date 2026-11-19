import { Link } from 'react-router-dom'
import { ArrowRight, Clock3 } from 'lucide-react'
import { Chip } from './UI.jsx'

export function ArticleImage({ article, className = '', priority = false }) {
  return <img src={article.image} alt={article.imageAlt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" className={`rounded-lg bg-[var(--soft)] object-cover ${className}`} />
}

export function ArticleCard({ article }) {
  return <article className="group flex h-full flex-col">
    <Link to={`/conteudos/${article.slug}`} aria-label={`Ler ${article.title}`} className="article-image-link block overflow-hidden rounded-lg"><ArticleImage article={article} className="aspect-[1.45] w-full transition-transform duration-200" /></Link>
    <div className="mt-4 flex items-center justify-between gap-3"><span className="eyebrow">{article.category}</span><span className="flex items-center gap-1 text-xs text-[var(--muted)]"><Clock3 size={13} />{article.readTime}</span></div>
    <h3 className="mt-2 text-xl font-extrabold leading-tight"><Link className="hover:text-[var(--brand)]" to={`/conteudos/${article.slug}`}>{article.title}</Link></h3>
    <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{article.summary}</p>
    <Link to={`/conteudos/${article.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">Ler artigo <ArrowRight size={16} /></Link>
  </article>
}

export function CategoryPills({ categories, selected, onSelect }) {
  return <div className="flex flex-wrap gap-2" aria-label="Filtrar conteúdos por tema">
    {categories.map(category => <Chip key={category} active={selected === category} onClick={() => onSelect(category)}>{category}</Chip>)}
  </div>
}
