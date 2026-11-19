import { useEffect, useRef, useState } from 'react'

const ROTATION_MS = 6500

export default function HeroBackground({ images, className = '' }) {
  const [active, setActive] = useState(0)
  const readyImages = useRef(new Set())
  const [readySources, setReadySources] = useState(() => new Set())

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches || images.length < 2) return undefined

    let interval
    const start = () => {
      if (!interval && !document.hidden && !motionPreference.matches) {
        interval = window.setInterval(() => setActive(current => {
          const next = (current + 1) % images.length
          return readyImages.current.has(images[next]) ? next : current
        }), ROTATION_MS)
      }
    }
    const stop = () => {
      window.clearInterval(interval)
      interval = undefined
    }
    const sync = () => {
      stop()
      start()
    }

    start()
    document.addEventListener('visibilitychange', sync)
    motionPreference.addEventListener('change', sync)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', sync)
      motionPreference.removeEventListener('change', sync)
    }
  }, [images])

  return <div className={`hero-background ${className}`} aria-hidden="true">
    {images.map((src, index) => <img key={src} src={src} alt="" onLoad={async event => {
      const element = event.currentTarget
      try { await element.decode() } catch { /* Keep the current slide while decoding. */ }
      if (element.naturalWidth > 0) { readyImages.current.add(src); setReadySources(current => new Set(current).add(src)) }
    }} className={index === active && readySources.has(src) ? 'hero-background__image is-active' : 'hero-background__image'} fetchPriority={index === 0 ? 'high' : 'auto'} />)}
  </div>
}
