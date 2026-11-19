import { useLayoutEffect } from 'react'

export default function ScrollMotion({ pathname }) {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const sections = document.querySelectorAll('#main-content main > section:not(:first-child), #main-content .section-banner, #main-content .institutional-reading__sections > section, #main-content .service-detail__body-content > section, #main-content .article-prose > section')
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        // Never fade content out after it is already visible on screen.
        entry.target.classList.remove('scroll-pending')
        entry.target.classList.add('scroll-entered')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0, rootMargin: '0px 0px 40px 0px' })
    sections.forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight + 40) return
      section.classList.add('scroll-pending')
      observer.observe(section)
    })
    return () => { observer.disconnect(); sections.forEach(section => section.classList.remove('scroll-pending', 'scroll-entered')) }
  }, [pathname])
  return null
}
