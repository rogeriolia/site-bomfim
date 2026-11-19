import { ArrowRight } from 'lucide-react'
import { Button } from './UI.jsx'

export default function EditorialFeature({ id, eyebrow, title, description, image, imageAlt, href, action, reverse = false, children }) {
  return <section className={`editorial-feature${reverse ? ' editorial-feature--reverse' : ''}`} aria-labelledby={id}>
    <div className="container-site editorial-feature__grid">
      <img className="editorial-feature__image" src={image} alt={imageAlt} loading="lazy" />
      <div className="editorial-feature__content">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="heading">{title}</h2>
        <p className="editorial-feature__description">{description}</p>
        {children}
        {action && <Button href={href} variant="outline" className="editorial-feature__action">{action}<ArrowRight size={17} aria-hidden="true" /></Button>}
      </div>
    </div>
  </section>
}
