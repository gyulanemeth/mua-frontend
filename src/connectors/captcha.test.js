import { test, beforeEach, expect, describe, vi } from 'vitest'

import stats from './stats.js'

const apiUrl = 'https:/mua/'

describe('test stats connectors', () => {
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

  global.FormData = class FormData {
    constructor () {
      this.entries = []
    }

    append (key, value) {
      this.entries.push([key, value])
    }
  }

  beforeEach(async () => {
    localStorage.setItem('accessToken', 'Token')
  })

  test('test overall stats', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { items: [], count: 0 } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await stats(fetch, apiUrl).getOverallStats()
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/statistics/overall',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer Token',
          'Content-Type': 'application/json'
        }
      })
    expect(res).toEqual({ items: [], count: 0 })
  })

  test('test get accounts stats', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { items: [], count: 0 } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await stats(fetch, apiUrl).getAccountsStats()
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/statistics/accounts',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer Token',
          'Content-Type': 'application/json'
        }
      })
    expect(res).toEqual({ items: [], count: 0 })
  })

  test('test get users stats', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { items: [], count: 0 } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await stats(fetch, apiUrl).getUsersStats()
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/statistics/users',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer Token',
          'Content-Type': 'application/json'
        }
      })
    expect(res).toEqual({ items: [], count: 0 })
  })
})
