import { defineStore } from 'pinia'

export default (connectors) => {
  const store = defineStore('stats', {
    actions: {
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
