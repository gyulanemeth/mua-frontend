import { createApp } from 'vue'
import { test, beforeEach, expect, describe } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import useTurnstileStore from './turnstile.js'

describe('turnstile Store', () => {
  const app = createApp({})

  const mokeConnector = () => {
    const mockGetTurnstileConfig = async function () {
      return { siteKey: 'test-site-key' }
    }

    return {
      getTurnstileConfig: mockGetTurnstileConfig
    }
  }

  beforeEach(() => {
    const pinia = createPinia().use(useTurnstileStore)
    app.use(pinia)
    setActivePinia(createPinia())
  })

  test('test get turnstile config', async () => {
    const turnstileStore = useTurnstileStore(mokeConnector())
    const store = turnstileStore()
    const res = await store.getTurnstileConfig()
    expect(res).toEqual({ siteKey: 'test-site-key' })
  })
})
