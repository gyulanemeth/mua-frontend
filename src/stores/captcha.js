import { defineStore } from 'pinia'

export default (connectors) => {
  const store = defineStore('mua-frontend-captcha', {
    actions: {
      async getCaptcha () {
        const res = await connectors.getCaptcha()
        return res
      }
    }
  })
  return store
}
