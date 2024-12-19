import { useMuaRoutes, muaBeforeEach } from './router/index.js'
import MuaErrorMessage from './components/ErrorMessage.vue'
import { setActivePinia } from 'pinia'
import 'vuetify/styles'
import { useAccountsStore as useMuaAccountStore, useUsersStore as useMuaUsersStore, useAdminsStore as useMuaAdminsStore } from './stores/index.js'
let pluginEnv = null
const MuaPlugin = {
  install (app, options = {}) {
    const { router, env, userComponents = {}, pinia } = options
    setActivePinia(pinia)
    pluginEnv = options.env
    import.meta.env = env
    app.config.globalProperties.$env = env
    if (router) {
      useMuaRoutes(router)
      router.beforeEach(async (to, from, next) => {
        await muaBeforeEach(to, from, next)
      })
    }
    app.component('MuaErrorMessage', MuaErrorMessage)
    if (userComponents.FinalizeRegistrationLinks) {
      app.component('CustomFinalizeRegistrationLinks', userComponents.FinalizeRegistrationLinks)
    }
    if (userComponents.AccountFinalizedMsg) {
      app.component('CustomAccountFinalizedMsg', userComponents.AccountFinalizedMsg)
    }
    if (userComponents.VerifyEmailMsg) {
      app.component('CustomVerifyEmailMsg', userComponents.VerifyEmailMsg)
    }
    if (userComponents.CustomSystemStats) {
      app.component('CustomSystemStats', userComponents.CustomSystemStats)
    }
  }
}

export { useMuaAccountStore, useMuaUsersStore, useMuaAdminsStore }

export default MuaPlugin

export const env = () => pluginEnv
