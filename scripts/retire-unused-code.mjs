import fs from 'node:fs'
import path from 'node:path'
import postcss from 'postcss'
const root = path.resolve(import.meta.dirname, '..')
// Confirmed unreachable from main.jsx, including dynamic imports.
const retired = ['components/FreightCostGraphic.jsx', 'components/RoutesPlanner.jsx', 'data/northeastMunicipalities.json', 'data/structure.js', 'pages/Structure.jsx']
for (const file of retired) {
  const source = path.join(root, 'src', file)
  const archive = path.join(root, '.retired-code', file)
  if (!fs.existsSync(source)) continue
  fs.mkdirSync(path.dirname(archive), { recursive: true })
  fs.renameSync(source, archive)
}
const unused = /\.(?:mega-menu__(?:quick(?:-list|-link)?|explore(?:-list|--grouped)?|feature|section-label|link(?:-copy)?)|brand-lab__(?:vehicle|uniform|cargo|shirt))(?![\w-])/
let removed = 0
for (const name of ['index.css', 'brand-tests.css']) {
  const file = path.join(root, 'src/styles', name)
  const original = fs.readFileSync(file, 'utf8')
  const css = postcss.parse(original)
  css.walkRules(rule => {
    const selectors = rule.selectors.filter(selector => !unused.test(selector))
    if (selectors.length === rule.selectors.length) return
    removed++
    if (selectors.length) rule.selectors = selectors
    else rule.remove()
  })
  fs.writeFileSync(file, css.toString())
}
console.log(`${removed} regras antigas de CSS retiradas; componentes arquivados em .retired-code.`)
