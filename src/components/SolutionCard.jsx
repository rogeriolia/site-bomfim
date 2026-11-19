import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SolutionCard({ service, image, showAction = true }) {
  return <Link className="solution-card" to={`/solucoes/${service.slug}`}>
    <img className="solution-card__image" src={image} alt="" loading="lazy" />
    <span className="solution-card__content">
      <strong className="solution-card__title">{service.name}</strong>
      <span className="solution-card__description">{service.intro}</span>
      {showAction && <span className="solution-card__action">Conhecer solução <ArrowRight size={16} aria-hidden="true" /></span>}
    </span>
  </Link>
}
