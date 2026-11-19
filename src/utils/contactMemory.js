const storageKey = 'bomfim:contact-profile:v1'
const maxAge = 30 * 24 * 60 * 60 * 1000
export function readContactMemory() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
    if (!saved || Date.now() - saved.updatedAt > maxAge) { localStorage.removeItem(storageKey); return {} }
    return saved.values || {}
  } catch { return {} }
}
export function rememberContactField(key, value) {
  try { localStorage.setItem(storageKey, JSON.stringify({ updatedAt: Date.now(), values: { ...readContactMemory(), [key]: String(value).slice(0, 160) } })) } catch { /* Form remains usable without storage. */ }
}
export function forgetContactMemory() {
  try { localStorage.removeItem(storageKey) } catch { /* Storage may be unavailable. */ }
}
