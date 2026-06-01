import { defineStore } from 'pinia'

export default (connectors) => {
  const store = defineStore('mua-frontend-turnstile', {
    actions: {
      async getTurnstileConfig () {
        return await connectors.getTurnstileConfig()
      }
    }
  })
  return store
}
