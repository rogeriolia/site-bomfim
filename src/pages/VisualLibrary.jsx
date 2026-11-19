import { visualLibrary } from '../data/visualLibrary.js'

export default function VisualLibrary() {
  return <main className="bg-[var(--canvas)] py-12 sm:py-16">
    <div className="container-site">
      <p className="eyebrow">Biblioteca visual · protótipo</p>
      <h1 className="heading mt-3 text-4xl sm:text-5xl">Acervo visual para o site Bomfim</h1>
      <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">Uma direção de fotografia operacional: pessoas, carga fracionada, frota leve e corredores rodoviários. Imagens conceituais geradas por IA para revisão; a marca nos veículos e uniformes deve ser conferida e aplicada com o arquivo vetorial oficial antes da produção.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visualLibrary.map(item => <article key={item.id} className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
          <a href={item.src} target="_blank" rel="noreferrer" aria-label={`Abrir imagem ${item.title}`}><img src={item.src} alt={item.alt} loading="lazy" className="aspect-video w-full object-cover" /></a>
          <div className="p-5"><p className="text-xs font-bold text-[var(--brand)]">{item.use}</p><h2 className="heading mt-2 text-xl">{item.title}</h2></div>
        </article>)}
      </div>
    </div>
  </main>
}
