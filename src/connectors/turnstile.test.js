import { test, beforeEach, expect, describe, vi } from 'vitest'
import turnstile from './turnstile.js'

const apiUrl = 'https:/mua/'

describe('test turnstile connectors', () => {
  global.localStorage = {
    data: {},
    getItem (key) {
      return this.data[key]
    },
    setItem (key, value) {
      this.data[key] = value
    },
    removeItem (key) {
      delete this.data[key]
    }
  }

  beforeEach(async () => {
    localStorage.setItem('accessToken', 'Token')
  })

  test('test getTurnstileConfig', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { siteKey: 'test-site-key' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await turnstile(fetch, apiUrl).getTurnstileConfig()
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/turnstile',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer Token',
          'Content-Type': 'application/json'
        }
      })
    expect(res).toEqual({ siteKey: 'test-site-key' })
  })
})
