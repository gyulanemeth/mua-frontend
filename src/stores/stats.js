import { defineStore } from 'pinia'

export default (connectors) => {
  const store = defineStore('mua-frontend-stats', {
    actions: {
      async getOverallStats (query) {
        const res = await connectors.getOverallStats(query)
        return res
      },
      async getAccountsStats (query) {
        const res = await connectors.getAccountsStats(query)
        return res
      },
      async getUsersStats (query) {
        const res = await connectors.getUsersStats(query)
        return res
      }
    }
  })
  return store
}
