import { useMuaRoutes, muaBeforeEach } from './router/index.js'
import MuaErrorMessage from './components/ErrorMessage.vue'
import { setActivePinia } from 'pinia'
import 'vuetify/styles'
import VueApexCharts from 'vue3-apexcharts'

import { useAccountsStore as useMuaAccountStore, useUsersStore as useMuaUsersStore, useAdminsStore as useMuaAdminsStore, useCaptchaStore as useMuaCaptchaStore, useStatsStore as useMuaStatsStore } from './stores/index.js'
const REQUIRED_OPTIONS = ['router', 'pinia', 'env']
const REQUIRED_ENV_VARS = [
  'VITE_API_BASE_URL',
  'VITE_APP_NAME',
  'VITE_APP_TITLE',
  'VITE_APP_BASE_URL',
  'VITE_APP_TERMS_URL',
  'VITE_APP_PRIVACY_URL'
]

function validateOptions (options) {
  for (const key of REQUIRED_OPTIONS) {
    if (!options[key]) {
      throw new Error(`mua-frontend: "${key}" is required but was not provided.`)
    }
  }
  for (const key of REQUIRED_ENV_VARS) {
    if (!options.env[key]) {
      throw new Error(`mua-frontend: env variable "${key}" is required but is missing.`)
    }
  }
}

let pluginEnv = null
const MuaPlugin = {
  install (app, options = {}) {
    validateOptions(options)
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
    app.component('CustomAccountExtraSettings', userComponents.AccountExtraSettings || { template: '<span></span>' })
    app.use(VueApexCharts)
  }
}

export { useMuaAccountStore, useMuaUsersStore, useMuaAdminsStore, useMuaCaptchaStore, useMuaStatsStore }

export default MuaPlugin

export const env = () => pluginEnv
