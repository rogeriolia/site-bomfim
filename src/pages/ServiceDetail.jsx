import EditorialText from '../components/EditorialText.jsx'
import '../styles/editorial-reading.css'
import '../styles/service-detail-refactor.css'
import { ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/UI.jsx'
import { serviceBySlug } from '../data/services.js'
import CargoRestrictionsFaq from '../components/CargoRestrictionsFaq.jsx'
import ServiceFaqChevron from '../components/ServiceFaqChevron.jsx'

const DEFAULT_SOLUTION_SLUG = 'coleta-programada'
const SOLUTION_NAV_SLUGS = [
  'carga-fracionada',
  'embarques-recorrentes',
  'coleta-programada',
  'distribuicao-personalizada',
  'agendamentos',
  'armazenagem',
  'cross-docking',
  'paletizacao',
  'e-commerce',
  'last-mile',
]

export default function ServiceDetail() {
  const { slug: slugParam } = useParams()
  if (slugParam && !serviceBySlug[slugParam]) {
    return (
      <main className="container-site section-space">
        <h1 className="heading text-4xl">Solução não encontrada</h1>
        <Link to="/solucoes" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-[var(--brand)]">
          Ver soluções <ArrowRight size={17} />
        </Link>
      </main>
    )
  }

  const resolvedSlug = slugParam || DEFAULT_SOLUTION_SLUG
  const service = serviceBySlug[resolvedSlug]

  const processDescription =
    service.editorial?.processDescription ||
    'Estas são etapas de avaliação, não uma promessa de prazo ou disponibilidade. A proposta concreta depende dos dados de cada embarque.'

  return (
    <main className="service-detail service-detail--cards">
      <div className="container-site service-detail__shell">
        <aside className="service-detail__sidebar">
          <nav className="service-detail__index" aria-label="Nesta página">
            <strong>Nesta página</strong>
            {SOLUTION_NAV_SLUGS.map((itemSlug) => serviceBySlug[itemSlug])
              .filter(Boolean)
              .map((item) => (
              <Link
                key={item.slug}
                to={`/solucoes/${item.slug}`}
                aria-current={item.slug === resolvedSlug ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="service-detail__main">
          <article className="service-detail__card">
            <section
              className="service-detail__hero"
              style={{ '--service-hero-image': `url("${service.heroImage}")` }}
            >
              <div className="service-detail__hero-grid">
                <div className="service-detail__hero-copy">
                  <h1 className="heading">{service.title}</h1>
                  <p className="service-detail__lead">
                    <EditorialText>{service.intro}</EditorialText>
                  </p>
                  <div className="service-detail__actions">
                    <Button href={service.primary.href}>
                      {service.primary.label} <ArrowRight size={17} />
                    </Button>
                    <Button href={service.secondary.href} variant="on-dark">
                      {service.secondary.label}
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section id="service-overview" className="service-detail__audience">
              <p className="eyebrow">Para quem faz sentido</p>
              <h2 className="heading">
                {service.editorial?.audienceTitle || 'Uma solução ligada ao jeito de embarcar.'}
              </h2>
              <p>
                <EditorialText>{service.audience}</EditorialText>
              </p>
            </section>
          </article>

          <article className="service-detail__card">
            <section id="service-process" className="service-detail__process">
              <div className="service-detail__intro">
                <p className="eyebrow">Como começamos</p>
                <h2 className="heading">
                  {service.editorial?.processTitle || 'O que dá forma à operação.'}
                </h2>
                <p>{processDescription}</p>
              </div>
              <ol className="service-detail__steps">
                {service.steps.map(([title, body], index) => (
                  <li key={title}>
                    <span className="service-detail__step-number">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{title}</h3>
                    <p>
                      <EditorialText>{body}</EditorialText>
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="service-detail__commercial" aria-labelledby="service-commercial-title">
              <div className="service-detail__commercial-image">
                <img
                  src="/assets/visuals-2026/04-hero-atendimento.webp"
                  alt="Profissional uniformizada da Bomfim em atendimento, com a marca no uniforme e no caminhão ao fundo"
                  loading="lazy"
                />
              </div>
              <div className="service-detail__commercial-copy">
                <p className="eyebrow">Próximo passo</p>
                <h2 id="service-commercial-title" className="heading">
                  Vamos entender o que sua operação precisa.
                </h2>
                <p>
                  Para um embarque pontual, comece pela cotação com os dados da carga e do trajeto. Se sua empresa
                  embarca todos os meses, fale com o time comercial: condições especiais podem ser preparadas de acordo
                  com a sua necessidade, frequência e perfil de operação.
                </p>
                <div className="service-detail__commercial-actions">
                  <Button href="/cotacao">
                    Iniciar cotação <ArrowRight size={17} />
                  </Button>
                  <Link to="/comercial" className="service-detail__text-action">
                    Falar com comercial <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>

            <section id="service-faq" className="service-detail__faq">
              <div className="service-detail__intro">
                <p className="eyebrow">Respostas rápidas</p>
                <h2 className="heading">Dúvidas comuns</h2>
              </div>
              <div className="service-detail__faq-list">
                {service.questions
                  .filter(([question]) => question !== 'Posso enviar qualquer mercadoria?')
                  .map(([question, answer]) => (
                    <details key={question}>
                      <summary>
                        <ServiceFaqChevron />
                        {question}
                      </summary>
                      <p>
                        <EditorialText>{answer}</EditorialText>
                      </p>
                    </details>
                  ))}
                <CargoRestrictionsFaq />
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  )
}