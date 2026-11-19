import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageMetadata } from '../data/pageMetadata.js'
import { preloadImage } from '../utils/pageLoading.js'

export default function NavigationPrefetch({ getPage }) {
  const { pathname } = useLocation()
  useEffect(() => {
    const connection = navigator.connection
    const saveData = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')
    if (saveData) return
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const prefetch = event => {
      const link = event.target.closest?.('a[href]')
      if (!link || link.hasAttribute('download') || link.target === '_blank') return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || (base && !url.pathname.startsWith(`${base}/`))) return
      const path = url.pathname.slice(base.length) || '/'
      if (path === pathname) return
      getPage(path)?.preload().catch(() => { /* Normal navigation can retry. */ })
      preloadImage(getPageMetadata(path).image)
    }
    document.addEventListener('pointerover', prefetch, { passive: true })
    document.addEventListener('focusin', prefetch)
    document.addEventListener('touchstart', prefetch, { passive: true })
    return () => {
      document.removeEventListener('pointerover', prefetch)
      document.removeEventListener('focusin', prefetch)
      document.removeEventListener('touchstart', prefetch)
    }
  }, [pathname, getPage])
  return null
}
