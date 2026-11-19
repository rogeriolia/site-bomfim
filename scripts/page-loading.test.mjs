import test from 'node:test'
import assert from 'node:assert/strict'
import { lazyPage } from '../src/utils/pageLoading.js'

test('prefetch and navigation share the same module request', async () => {
  let requests = 0
  const module = { default: () => null }
  const page = lazyPage(async () => { requests++; return module })
  const first = page.preload()
  assert.equal(page.preload(), first)
  assert.equal(await first, module)
  assert.equal(await page.preload(), module)
  assert.equal(requests, 1)
})

test('a failed speculative request can be retried by navigation', async () => {
  let requests = 0
  const page = lazyPage(async () => {
    if (++requests === 1) throw new Error('Temporary network failure')
    return { default: () => null }
  })
  await assert.rejects(page.preload(), /Temporary network failure/)
  assert.equal(typeof (await page.preload()).default, 'function')
  assert.equal(requests, 2)
})
