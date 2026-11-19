import test from 'node:test'
import assert from 'node:assert/strict'
import { navigation } from '../src/data/navigation.js'

test('all ten solutions are available in four categories', () => {
  const solutions = navigation.find(item => item.label === 'Soluções')
  const links = solutions.groups.flatMap(group => group.children)
  assert.equal(solutions.groups.length, 4)
  assert.equal(links.length, 10)
  assert.equal(new Set(links.map(item => item.href)).size, 10)
  assert.ok(links.some(item => item.label === 'Last mile'))
  assert.ok(links.every(item => !item.image && item.description))
})

test('coverage offers three distinct tasks and commercial has no duplicate action', () => {
  const coverage = navigation.find(item => item.label === 'Cobertura')
  assert.deepEqual(coverage.children.map(item => item.href), ['/rotas', '/rotas/planejar', '/unidades'])
  const commercial = navigation.find(item => item.label === 'Comercial')
  assert.equal(commercial.children.length, 3)
  assert.equal(commercial.action, undefined)
})

test('public navigation has no decorative image mappings or test links', () => {
  const items = navigation.flatMap(item => [...(item.children || []), ...(item.groups || []).flatMap(group => group.children)])
  for (const item of items) {
    assert.ok(item.description)
    assert.ok(!item.image)
    assert.ok(!/design-system|biblioteca-visual|estudo-marca/.test(item.href))
  }
})
