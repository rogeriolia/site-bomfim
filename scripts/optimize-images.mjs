import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const assets = path.join(root, 'public/assets')
const backup = path.join(root, '.asset-originals')
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)])
const sources = [...walk(path.join(root, 'src')), ...walk(path.join(root, 'public/data'))].filter(file => /\.(jsx?|css|json|html)$/.test(file))
let before = 0, after = 0, count = 0
for (const file of walk(assets)) {
  // Keep downloadable brand masters unchanged, including their transparency.
  if (!/\.(png|jpe?g|webp)$/i.test(file) || file.includes('/brand-tests/') || fs.statSync(file).size < 150000) continue
  const relative = path.relative(assets, file)
  const target = file.replace(/\.(png|jpe?g)$/i, '.webp')
  if (target !== file && fs.existsSync(target)) continue
  const temporary = `${target}.optimized.webp`
  execFileSync('cwebp', ['-quiet', '-q', '82', '-m', '6', file, '-o', temporary])
  const originalSize = fs.statSync(file).size
  const optimizedSize = fs.statSync(temporary).size
  if (optimizedSize >= originalSize * 0.95) { fs.unlinkSync(temporary); continue }
  const archive = path.join(backup, relative)
  fs.mkdirSync(path.dirname(archive), { recursive: true })
  if (!fs.existsSync(archive)) fs.copyFileSync(file, archive)
  fs.renameSync(temporary, target)
  if (target !== file) {
    const oldPath = `/assets/${relative.split(path.sep).join('/')}`
    const newPath = oldPath.replace(/\.(png|jpe?g)$/i, '.webp')
    for (const source of sources) {
      const text = fs.readFileSync(source, 'utf8')
      const updated = text.replaceAll(oldPath, newPath)
      if (updated !== text) fs.writeFileSync(source, updated)
    }
    fs.unlinkSync(file)
  }
  before += originalSize; after += optimizedSize; count++
}
console.log(JSON.stringify({ count, originalBytes: before, optimizedBytes: after, savedBytes: before - after, originals: backup }, null, 2))
