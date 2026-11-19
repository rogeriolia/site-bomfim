import { lazy as reactLazy } from 'react'

export function lazyPage(loader) {
  let promise
  const preload = () => promise ||= loader().catch(error => { promise = undefined; throw error })
  const page = reactLazy(preload)
  page.preload = preload
  return page
}

const readyImages = new Set()
const pendingImages = new Map()
export const isImageReady = source => readyImages.has(source)
export function preloadImage(source) {
  if (!source || readyImages.has(source) || pendingImages.has(source)) return
  const image = new Image()
  pendingImages.set(source, image)
  image.onload = async () => {
    try { await image.decode() } catch { /* The browser may already have decoded it. */ }
    if (image.naturalWidth) readyImages.add(source)
    pendingImages.delete(source)
  }
  image.onerror = () => pendingImages.delete(source)
  image.src = source
}
export function markImageReady(source) { readyImages.add(source) }
