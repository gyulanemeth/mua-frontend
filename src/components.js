import FinalizeRegistrationView from './views/FinalizeRegistrationView.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import MuaErrorMessage from './components/ErrorMessage.vue'

export const components = { FinalizeRegistrationView, AdminDashboard, MuaErrorMessage }
export default {
  install (app) {
    Object.keys(components).forEach((key) => {
      app.component(key, components[key])
    })
  }
}
