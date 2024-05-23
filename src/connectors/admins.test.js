import { test, beforeEach, expect, describe, vi } from 'vitest'

import admins from './admins.js'

const apiUrl = 'https:/mua/accounts'

describe('test admins connectors', () => {
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
  global.window = {
    config: {
      apiBaseUrl: 'http://api.emailfox.link'
    }
  }

  beforeEach(async () => {
    localStorage.setItem('accessToken', 'Token')
  })

  test('test readOne', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'admin name' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admins(fetch, apiUrl).admin.readOne({ id: '123' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/admins/123',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ _id: '123', name: 'admin name' })
  })

  test('test readOne account error route error', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'admin name' } })
    })

    await expect(admins(fetch, apiUrl).admin.readOne()).rejects.toThrowError('Admin ID Is Required')
  })
})
