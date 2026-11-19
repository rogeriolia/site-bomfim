import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/UI.jsx'
import SolutionCard from '../components/SolutionCard.jsx'
import { services } from '../data/services.js'
import '../styles/solutions-refresh.css'

const serviceImages = {
  'carga-fracionada': '/assets/visuals-2026/06-conferencia.webp',
  'embarques-recorrentes': '/assets/visuals-2026/08-motorista.webp',
  'coleta-programada': '/assets/visuals-2026/03-hero-coleta.webp',
  'distribuicao-personalizada': '/assets/visuals-2026/14-distribuicao-urbana.webp',
}
const groups = [
  { title: 'Transporte', intro: 'Para enviar volumes, abastecer clientes e manter uma rotina de embarques.', slugs: ['carga-fracionada', 'embarques-recorrentes'] },
  { title: 'Coordenação da operação', intro: 'Para alinhar coleta, destinos, janelas e diferentes etapas do atendimento.', slugs: ['coleta-programada', 'distribuicao-personalizada', 'agendamentos'] },
  { title: 'Estrutura e movimentação', intro: 'Para organizar, proteger, armazenar e transferir a carga com mais controle.', slugs: ['armazenagem', 'cross-docking', 'paletizacao'] },
  { title: 'Entrega ao cliente', intro: 'Para operações de e-commerce e entregas em que a última etapa influencia a experiência.', slugs: ['e-commerce', 'last-mile'] },
]
const bySlug = Object.fromEntries(services.map(service => [service.slug, service]))

export default function SolutionsOverview() {
  return <main className="solutions-overview-page">
    <section className="solutions-overview">
      <div className="container-site solutions-overview__grid">
        <div className="solutions-overview__copy">
          <h1 className="heading">Soluções para sua carga.</h1>
          <p className="solutions-overview__lead">Transporte, armazenagem e distribuição no Nordeste. Encontre o serviço para enviar seus produtos, organizar o estoque ou abastecer seus clientes.</p>
          <div className="flex flex-wrap gap-3"><Button href="/cotacao">Iniciar cotação <ArrowRight size={17} /></Button><Button href="/comercial" variant="outline">Falar com comercial <ArrowRight size={17} /></Button></div>
        </div>
        <img className="solutions-overview__hero-image" src="/assets/visuals-2026/06-conferencia.webp" alt="Conferência de carga na operação logística Bomfim" fetchPriority="high"/>
      </div>
    </section>
    <nav className="container-site solutions-jump" aria-label="Encontrar solução por necessidade">{groups.map((group, index) => <a key={group.title} href={`#solucoes-grupo-${index}`}>{group.title}<ArrowRight size={16}/></a>)}</nav>
    <section className="container-site solutions-overview__groups" aria-label="Soluções organizadas por necessidade">{groups.map((group, index) => <section key={group.title} id={`solucoes-grupo-${index}`} className="solutions-overview__group"><div className="solutions-overview__group-heading"><h2 className="heading">{group.title}</h2><p>{group.intro}</p></div><div className="solutions-overview__group-grid">{group.slugs.map(slug => { const service = bySlug[slug]; return <SolutionCard key={slug} service={service} image={serviceImages[slug] || service.illustration} /> })}</div></section>)}</section>
    <section className="solutions-overview__decision"><div className="container-site"><div className="solutions-overview__decision-heading"><h2 className="heading">Antes de contratar.</h2><p>Escolher uma transportadora envolve mais do que comparar preço. Você precisa entender risco, prazo, acompanhamento, cobertura e o que acontece quando a operação sai do planejado.</p></div><div className="solutions-overview__decision-grid"><div><h3>O prazo será cumprido?</h3><p>Prazo depende de origem, destino, disponibilidade da carga, janela de recebimento e condições do trecho. Essas premissas precisam aparecer na conversa e na proposta.</p></div><div><h3>Minha carga será bem cuidada?</h3><p>Embalagem, identificação, conferência, manuseio, gerenciamento de risco e perfil da mercadoria interferem na segurança do embarque.</p></div><div><h3>Vou saber onde a carga está?</h3><p>Combine qual referência será usada, onde consultar a movimentação, como acessar comprovantes e qual canal deve ser acionado em uma ocorrência.</p></div><div><h3>O preço final pode mudar?</h3><p>Dimensões, cubagem, acessos, agendamento, restrições e taxas podem alterar a composição do frete. Pergunte o que está incluído.</p></div></div></div></section>
    <section className="container-site solutions-overview__checklist"><div className="solutions-overview__checklist-copy"><h2 className="heading">Prepare sua cotação.</h2><p>Uma cotação mais precisa começa com informações que ajudam a equipe a entender o impacto do transporte no seu negócio.</p></div><ul>{['Origem, destino e CEP dos endereços reais', 'Tipo de mercadoria, embalagem, peso e dimensões', 'Quantidade de volumes e valor declarado', 'Frequência, sazonalidade e volume mensal', 'Janelas de coleta e recebimento', 'Restrições de acesso, doca ou circulação', 'Indicadores ou ocorrências que você precisa reduzir'].map(item => <li key={item}><CheckCircle2 size={18} />{item}</li>)}</ul></section>
    <section className="solutions-contact-band" aria-labelledby="solutions-contact-title">
      <div className="container-site solutions-contact-band__inner">
        <div><h2 id="solutions-contact-title" className="heading">Planeje seus próximos embarques.</h2><p>Leve cidades, frequência e perfil da carga para uma conversa com o time comercial.</p></div>
        <Button href="/comercial">Conversar com comercial <ArrowRight size={17} aria-hidden="true" /></Button>
      </div>
    </section>
  </main>
}
