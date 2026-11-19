import { useEffect, useRef, useState } from 'react'
import { isImageReady, markImageReady } from '../utils/pageLoading.js'

/** Reveal only the decoded photograph; the hero background and text stay opaque. */
export default function HeroImage({ src, className = '', ...props }) {
  const ref = useRef(null)
  const [decodedSource, setDecodedSource] = useState(() => isImageReady(src) ? src : null)
  useEffect(() => {
    const element = ref.current
    let active = true
    const reveal = async () => {
      try { await element.decode() } catch { /* Some browsers cannot decode explicitly. */ }
      if (active && element.naturalWidth > 0) { markImageReady(src); setDecodedSource(src) }
    }
    if (element.complete && element.naturalWidth > 0) reveal()
    element.addEventListener('load', reveal)
    return () => { active = false; element.removeEventListener('load', reveal) }
  }, [src])
  return <img ref={ref} src={src} fetchPriority="high" {...props} decoding="async" className={`hero-image ${decodedSource === src || isImageReady(src) ? 'hero-image--ready' : ''} ${className}`} />
}
