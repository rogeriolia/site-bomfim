import HeroImage from './HeroImage.jsx'
import HeroBackground from './HeroBackground.jsx'

export function MarketingHero({ image, size = 'large', children, className = '' }) {
  return <section className={`marketing-hero marketing-hero--${size} bg-[var(--dark)] text-white ${className}`}>
    {Array.isArray(image) ? <HeroBackground images={image} /> : <HeroImage src={image} alt="" aria-hidden="true" fetchPriority="high" />}
    <div className="hero-content container-site flex flex-col justify-center py-16">{children}</div>
  </section>
}

export function HeroActions({ children, className = '' }) {
  return <div className={`mt-8 flex flex-wrap gap-3 ${className}`}>{children}</div>
}

export function HeroUtilityLinks({ children }) {
  return <nav aria-label="Acessos rápidos" className="mt-12 flex flex-wrap gap-6 text-sm font-semibold text-white/90">{children}</nav>
}
