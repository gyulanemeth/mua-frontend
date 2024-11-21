import { useMuaRoutes, muaBeforeEach } from './router/index.js'
import components from './components.js'

const MuaPlugin = {
  install (app, options = {}) {
    const { router, pinia } = options
    if (router) {
      useMuaRoutes(router)
      router.beforeEach(async (to, from, next) => {
        await muaBeforeEach(to, from, next)
      });
    }
    components.install(app)
  }
}

export default MuaPlugin
