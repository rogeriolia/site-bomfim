import pages from './pageCatalog.json'
import articles from './articles.json'
import routes from './routes.json'
import { services } from './services.js'

export function getRouteImage(route) {
  const images = { 'Recife': 'recife', 'Maceió': 'maceio', 'Natal': 'natal', 'Salvador': 'salvador', 'Fortaleza': 'fortaleza', 'Aracaju': 'aracaju', 'Feira de Santana': 'feira-de-santana', 'João Pessoa': 'joao-pessoa' }
  return images[route.destination] ? `/assets/units/${images[route.destination]}.webp` : '/assets/hero-intercapital-bomfim-v2.webp'
}

export function getPageMetadata(pathname) {
  const thankYouPages = {
    '/obrigado/cotacao': { title: 'Pedido de cotação recebido', heading: 'Recebemos seu pedido de cotação.', description: 'A equipe Bomfim vai continuar a conversa pelo contato informado.', image: '/assets/visuals-2026/05-hero-corredores.webp', area: 'conversion', indexable: false },
    '/obrigado/embarques-frequentes': { title: 'Solicitação recebida', heading: 'Vamos avaliar sua rotina.', description: 'O time comercial dará sequência pelo contato informado.', image: '/assets/visuals-2026/16-hero-home-recorrente.webp', area: 'conversion', indexable: false },
    '/obrigado/comercial': { title: 'Contato comercial recebido', heading: 'Recebemos sua solicitação.', description: 'A equipe comercial vai analisar o contexto da sua operação e retornar pelo contato informado.', image: '/assets/visuals-2026/04-hero-atendimento.webp', area: 'conversion', indexable: false },
  }
  if (thankYouPages[pathname]) return thankYouPages[pathname]
  const paidPages = {
    '/lp/cotacao': { title: 'Solicitar cotação', heading: 'Cote seu próximo embarque.', description: 'Deixe seu contato para iniciar uma cotação de transporte empresarial com a equipe Bomfim.', image: '/assets/visuals-2026/05-hero-corredores.webp', area: 'conversion', indexable: false },
    '/lp/cotacao-completa': { title: 'Cotação por rota', heading: 'Vamos começar pela sua rota.', description: 'Escolha cidades ou CEPs na cobertura Bomfim e deixe seu contato para continuar com atendimento pessoal.', image: '/assets/visuals-2026/05-hero-corredores.webp', area: 'conversion', indexable: false },
    '/lp/embarques-frequentes': { title: 'Embarques frequentes', heading: 'Planeje seus embarques.', description: 'Converse com a equipe Bomfim sobre os embarques frequentes da sua empresa.', image: '/assets/visuals-2026/16-hero-home-recorrente.webp', area: 'conversion', indexable: false },
    '/lp/falar-comercial': { title: 'Falar com o comercial', heading: 'Vamos planejar sua operação.', description: 'Deixe seu contato e converse com a equipe comercial Bomfim sobre sua operação.', image: '/assets/visuals-2026/04-hero-atendimento.webp', area: 'conversion', indexable: false },
  }
  if (paidPages[pathname]) return paidPages[pathname]
  if (pathname === '/estudo-marca-bomfim') return { title: 'Estudo de assinaturas da marca', heading: 'Duas assinaturas. A mesma origem.', description: 'Comparação de propostas Bomfim log e Bomfim Cargas em aplicações.', image: '/assets/brand-tests/bomfim-cargas.png', area: 'utility', indexable: false }
  if (pages[pathname]) return pages[pathname]
  const article = articles.find(item => pathname === `/conteudos/${item.slug}`)
  if (article) return { title: article.title, heading: article.title, description: article.summary, image: article.image, imageAlt: article.imageAlt, area: 'content', type: 'article', indexable: true }
  const service = services.find(item => pathname === `/solucoes/${item.slug}`)
  if (service) return { title: `${service.name} para empresas`, heading: service.title, description: service.metaDescription || service.intro, image: service.illustration, imageAlt: service.visualAlt, area: 'institutional', indexable: true }
  const route = routes.find(item => pathname === `/rotas/${item.id}`)
  if (route) return { title: `${route.origin} para ${route.destination}: distribuição e estoques`, heading: `${route.origin} → ${route.destination}`, description: `Planeje a distribuição de ${route.origin} para ${route.destination}. Confira os pontos de referência e reúna as informações para avaliar sua operação com a Bomfim.`, image: getRouteImage(route), area: 'institutional', indexable: true }
  return { title: 'Página não encontrada', heading: 'Página não encontrada', description: 'O endereço solicitado não foi encontrado. Explore as soluções, rotas e conteúdos da Bomfim Cargas.', image: '/assets/visuals-2026/05-hero-corredores.webp', area: 'utility', indexable: false }
}

export function applyPageMetadata(pathname) {
  const page = getPageMetadata(pathname)
  const title = `${page.title} | Bomfim Cargas`
  const absolute = path => new URL(path.startsWith(import.meta.env.BASE_URL) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`, window.location.origin).href
  const setMeta = (key, value, attribute = 'name') => {
    let node = document.head.querySelector(`meta[${attribute}="${key}"]`)
    if (!node) { node = document.createElement('meta'); node.setAttribute(attribute, key); document.head.appendChild(node) }
    node.content = value
  }
  document.title = title
  setMeta('description', page.description)
  // Homologação permanece fora de buscadores; produção precisa de ativação explícita.
  setMeta('robots', import.meta.env.VITE_PUBLIC_INDEXING === 'true' && page.indexable ? 'index, follow' : 'noindex, nofollow')
  for (const [key,value] of Object.entries({title,description:page.description,image:absolute(page.image),url:absolute(page.canonicalPath || pathname),type:page.type || 'website',site_name:'Bomfim Cargas',locale:'pt_BR'})) setMeta(`og:${key}`,value,'property')
  setMeta('og:image:alt',page.imageAlt || page.heading,'property')
  setMeta('twitter:card','summary_large_image')
  setMeta('twitter:title',title)
  setMeta('twitter:description',page.description)
  setMeta('twitter:image',absolute(page.image))
  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) { canonical=document.createElement('link'); canonical.rel='canonical'; document.head.appendChild(canonical) }
  canonical.href=absolute(page.canonicalPath || pathname)
}
