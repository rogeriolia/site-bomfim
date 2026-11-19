import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import articles from '../data/articles.json'

const featuredSlugs = ['estoque-cheio-produto-faltando', 'pedido-whatsapp-acompanhamento', 'varejo-media-e-mix']

const articleBySlug = new Map(articles.map(article => [article.slug, article]))

function ShowcaseCard({ article, homeCopy }) {
  return <article className="content-showcase__card">
    <Link to={`/conteudos/${article.slug}`} className="content-showcase__image" aria-label={`Ler ${article.title}`}><img src={article.image} alt={article.imageAlt} loading="lazy" /></Link>
    <div className="content-showcase__card-body">{!homeCopy && <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{article.showcaseTheme || article.category}</p>}<h3 className="mt-2 text-lg font-bold leading-snug"><Link to={`/conteudos/${article.slug}`} className="hover:text-[var(--brand)]">{article.title}</Link></h3><Link to={`/conteudos/${article.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">Ler conteúdo <ArrowRight size={16} aria-hidden="true" /></Link></div>
  </article>
}

export default function ContentShowcase({ homeCopy = false }) {
  const shown = featuredSlugs.map(slug => articleBySlug.get(slug)).filter(Boolean)

  return <section className="content-showcase bg-white py-10 sm:py-12" aria-labelledby="content-showcase-title"><div className="container-site">
    <div className="flex flex-wrap items-end justify-between gap-5"><div>{!homeCopy && <span className="line-accent" aria-hidden="true" />}<h2 id="content-showcase-title" className="heading mt-4 text-3xl sm:text-4xl">{homeCopy ? 'Estoque, mercado e logística' : 'Conteúdo para quem faz o negócio acontecer'}</h2><p className="mt-2 text-[var(--muted)]">{homeCopy ? 'Leituras sobre decisões de estoque, distribuição e operação.' : 'Mercado, gestão e operação: leituras úteis para sua próxima decisão.'}</p></div></div>
    <div className="mt-6 grid gap-4 md:grid-cols-3">{shown.map(article => <ShowcaseCard key={article.slug} article={article} homeCopy={homeCopy} />)}</div>
    <div className="mt-6 text-right"><Link to="/conteudos" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">Ver todos os conteúdos <ArrowRight size={17} aria-hidden="true" /></Link></div>
    <div className="content-showcase__banner mt-7"><img src="/assets/visuals-2026/17-banner-cobertura.webp" alt="" aria-hidden="true" loading="lazy" /><div className="content-showcase__banner-panel">{!homeCopy && <span className="line-accent" aria-hidden="true" />}<h3 className="heading mt-4 max-w-md text-2xl sm:text-3xl">{homeCopy ? 'Vai enviar uma carga? Solicite uma cotação.' : 'Sua próxima cotação começa com uma boa conversa.'}</h3><Link to={homeCopy ? "/cotacao" : "/contato"} className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-full bg-[var(--brand)] px-6 text-sm font-bold text-white hover:bg-[var(--brand-hover)]">{homeCopy ? 'Solicitar cotação' : 'Falar com comercial'} <ArrowRight size={17} aria-hidden="true" /></Link></div>{!homeCopy && <p className="content-showcase__banner-note">Conectando os nordestinos com transporte eficiente e confiável.</p>}</div>
  </div></section>
}
