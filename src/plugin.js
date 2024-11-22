import { useMuaRoutes, muaBeforeEach } from './router/index.js'
import components from './components.js'

const MuaPlugin = {
  install (app, options = {}) {
    const { router, userComponents={} } = options
    if (router) {
      useMuaRoutes(router)
      router.beforeEach(async (to, from, next) => {
        await muaBeforeEach(to, from, next)
      });
    }
    components.install(app)
    if (userComponents.FinalizeRegistrationLinks) {
      app.component('CustomFinalizeRegistrationLinks', userComponents.FinalizeRegistrationLinks);
    }
    if (userComponents.AccountFinalizedMsg) {
      app.component('CustomAccountFinalizedMsg', userComponents.AccountFinalizedMsg);
    }
    if (userComponents.VerifyEmaVerifyEmailMsg) {
      app.component('CustomVerifyEmaVerifyEmailMsg', userComponents.VerifyEmaVerifyEmailMsg);
    }
    if (userComponents.CustomSystemStats) {
      app.component('CustomSystemStats', userComponents.CustomSystemStats);
    }
  }
}

export default MuaPlugin
