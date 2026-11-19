import EditorialText from '../components/EditorialText.jsx'
import HeroImage from '../components/HeroImage.jsx'
import pageCatalog from '../data/pageCatalog.json'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react'
import articles from '../data/articles.json'
import { articleBodies } from '../data/articleBodies.js'
import { editorialSources } from '../data/editorialSources.js'
import { ArticleCard, ArticleImage, CategoryPills } from '../components/ContentExperience.jsx'
import { Button, Field } from '../components/UI.jsx'
import SectionBanner from '../components/SectionBanner.jsx'

const categories = ['Todos', ...new Set(articles.map(article => article.category))]

export function ContentPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const category = categories.includes(params.get('tema')) ? params.get('tema') : 'Todos'
  const featured = articles[0]
  const filtered = (category === 'Todos' ? articles : articles.filter(article => article.category === category)).filter(article => article.slug !== featured.slug || category !== 'Todos')
  const selectCategory = value => setParams(value === 'Todos' ? {} : { tema: value }, { replace: true })

  return <main>
    <section className="content-feature-hero" aria-labelledby="content-feature-title">
      <HeroImage src={pageCatalog["/conteudos"].image} alt="" aria-hidden="true" fetchPriority="high" decoding="async" className="content-feature-hero__image" />
      <div className="container-site content-feature-hero__inner">
        <div className="content-feature-hero__copy"><p className="eyebrow">Em destaque · {featured.category}</p><h1 id="content-feature-title" className="heading mt-4 text-4xl sm:text-5xl" tabIndex={-1}>Informação para o dia a dia da sua empresa.</h1><p className="mt-5 max-w-lg text-lg leading-7">{featured.title} — {featured.summary}</p><Link className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white underline-offset-4 hover:underline" to={`/conteudos/${featured.slug}`}>Ler artigo completo <ArrowRight size={18} /></Link></div>
      </div>
    </section>
    <section className="border-y border-[var(--line)] bg-[var(--canvas)] py-5"><div className="container-site flex flex-wrap items-center gap-3"><strong className="mr-2 text-sm">Explorar por tema</strong><CategoryPills categories={categories} selected={category} onSelect={selectCategory} /></div></section>
    <section className="container-site section-space" aria-labelledby="content-list-title">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Biblioteca Bomfim</p><h2 id="content-list-title" className="heading mt-3 text-3xl sm:text-4xl">{category === 'Todos' ? 'Leituras para sua operação' : category}</h2><p className="mt-3 max-w-2xl text-[var(--muted)]">Mercado, estoque, produtividade e transporte para decisões do dia a dia.</p></div><span className="text-sm text-[var(--muted)]">{category === 'Todos' ? `${articles.length} conteúdos · 1 em destaque` : `${filtered.length} ${filtered.length === 1 ? 'conteúdo' : 'conteúdos'}`}</span></div>
      {filtered.length ? <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">{filtered.map(article => <ArticleCard key={article.slug} article={article} />)}</div> : <div className="surface p-8"><h3 className="text-lg font-bold">Nenhum conteúdo neste tema</h3><p className="mt-2 text-[var(--muted)]">Explore os demais assuntos da biblioteca.</p><button className="mt-4 min-h-11 text-sm font-bold text-[var(--brand)] underline" onClick={() => selectCategory('Todos')}>Ver todos os conteúdos</button></div>}
    </section>
    <SectionBanner variant="editorial" />
    <section className="content-subscribe" aria-labelledby="content-subscribe-title"><div className="container-site content-subscribe__inner"><div><p className="eyebrow">Acompanhe os conteúdos</p><h2 id="content-subscribe-title" className="heading mt-3 text-3xl sm:text-4xl">Informação útil para sua próxima decisão.</h2><p className="mt-4 max-w-xl text-[var(--subtle)]">Leituras sobre mercado, gestão e operação, com exemplos práticos e referências para aprofundar.</p></div><form onSubmit={event => { event.preventDefault(); navigate('/obrigado/conteudos') }}><div className="content-subscribe__form-row"><Field id="newsletter-email" label="Seu e-mail corporativo" type="email" autoComplete="email" required placeholder="voce@empresa.com.br" /><Button type="submit">Acompanhar conteúdos <ArrowRight size={18} aria-hidden="true" /></Button></div><p className="mt-3 text-xs text-[var(--muted)]">Demonstração: nenhum e-mail será enviado. Seu contato fica lembrado neste navegador por 30 dias.</p></form></div></section>
  </main>
}

function ArticleSections({ sections }) {
  return <div className="article-prose">{sections.map((section, index) => <section id={`secao-${index + 1}`} key={section.heading} className="scroll-mt-8"><h2>{section.heading}</h2>{section.paragraphs?.map(text => <p key={text}><EditorialText>{text}</EditorialText></p>)}{section.bullets && <ul>{section.bullets.map(text => <li key={text}><EditorialText>{text}</EditorialText></li>)}</ul>}{section.references?.length > 0 && <p className="article-source-links">Referências deste trecho: {section.references.map((id, sourceIndex) => <span key={id}>{sourceIndex > 0 && ' · '}<a href={editorialSources[id].url} target="_blank" rel="noreferrer">{editorialSources[id].title}<span className="visually-hidden"> (abre em outra aba)</span></a></span>)}</p>}</section>)}</div>
}

function ArticleSources({ sourceIds }) {
  if (!sourceIds?.length) return null
  return <section className="article-sources" aria-labelledby="article-sources-title"><h2 id="article-sources-title">Fontes e referências</h2><p>Confira os períodos e o alcance das informações usadas nesta leitura.</p><ul>{sourceIds.map(id => { const source = editorialSources[id]; return <li key={id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<span className="visually-hidden"> (abre em outra aba)</span></a><p>{source.period}.</p></li> })}</ul></section>
}

export function ArticlePage() {
  const { slug } = useParams()
  const article = articles.find(item => item.slug === slug)
  if (!article) return <main className="container-site section-space"><h1 className="heading text-4xl" tabIndex={-1}>Conteúdo não encontrado</h1><Button href="/conteudos" className="mt-6">Voltar aos conteúdos</Button></main>
  const sections = articleBodies[slug] || []
  const explicitRelated = (article.relatedSlugs || []).map(id => articles.find(item => item.slug === id)).filter(Boolean)
  const related = [...new Map([...explicitRelated, ...articles.filter(item => item.slug !== slug && item.category === article.category), ...articles.filter(item => item.slug !== slug)].map(item => [item.slug, item])).values()].slice(0, 2)

  return <main><article className="container-site article-detail">
    <header className="article-detail__header"><h1 className={`heading ${article.title.length > 60 ? "article-detail__title--long" : ""}`} tabIndex={-1}>{article.title}</h1><p className="article-detail__summary">{article.summary}</p><div className="article-detail__meta"><span className="inline-flex items-center gap-1"><Clock3 size={16} aria-hidden="true" /> Leitura de {article.readTime}</span><span aria-hidden="true">·</span><time dateTime={article.updatedAt}>Atualizado em {article.updatedAt.split('-').reverse().join('/')}</time></div></header>
    <figure className={`article-detail__image ${slug === 'o-que-compoe-o-valor-do-frete' ? 'article-detail__image--study' : ''}`}><ArticleImage article={article} priority className="w-full" /></figure>
    <div className="article-detail__body grid gap-8 lg:grid-cols-[220px_minmax(0,700px)] lg:gap-16"><aside className="lg:sticky lg:top-8 lg:self-start"><h2 className="text-sm font-bold">Nesta leitura</h2><ol className="mt-4 space-y-3 border-l border-[var(--line)] pl-4">{sections.map((section, index) => <li key={section.heading}><a href={`#secao-${index + 1}`} className="text-sm leading-5 text-[var(--subtle)] hover:text-[var(--brand)]">{section.heading}</a></li>)}</ol></aside><div><ArticleSections sections={sections} /><ArticleSources sourceIds={article.sources} /></div></div>
    <div className="mt-16 border-t border-[var(--line)] pt-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Continue explorando</p><h2 className="heading mt-2 text-2xl sm:text-3xl">Outras leituras úteis</h2></div><Link to="/conteudos" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--brand)]">Ver biblioteca <ArrowRight size={17} /></Link></div><div className="mt-7 grid gap-7 sm:grid-cols-2">{related.map(item => <ArticleCard key={item.slug} article={item} />)}</div></div>
    <Link to="/conteudos" className="mt-12 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--brand)]"><ArrowLeft size={17} />Voltar aos conteúdos</Link>
  </article></main>
}
