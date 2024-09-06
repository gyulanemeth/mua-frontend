import { createApp } from 'vue'
import { test, beforeEach, expect, describe } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import useStatsStore from './stats.js'

describe('stats Store', () => {
  const app = createApp({})

  const mokeConnector = () => {
    const mockGetAccountStats = async function () {
      return { items: [], count: 0 }
    }

    const mockGetUsersStats = async function () {
      return { items: [], count: 0 }
    }

    return {
      getAccountsStats: mockGetAccountStats, getUsersStats: mockGetUsersStats
    }
  }

  beforeEach(() => {
    const pinia = createPinia().use(useStatsStore)
    app.use(pinia)
    setActivePinia(createPinia())
  })

  test('test get accounts stats', async () => {
    const statsStore = useStatsStore(mokeConnector())
    const stats = statsStore()
    const res = await stats.getAccountsStats()
    expect(res).toEqual({ items: [], count: 0 })
  })

  test('test get users stats', async () => {
    const statsStore = useStatsStore(mokeConnector())
    const stats = statsStore()
    const res = await stats.getUsersStats()
    expect(res).toEqual({ items: [], count: 0 })
  })
})
