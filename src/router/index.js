import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UpdatePassword from '../components/UpdatePassword.vue'
import EmailAndNameFormView from '../views/EmailAndNameFormView.vue'
import SetAndReSetPasswordView from '../views/SetAndReSetPasswordView.vue'
import Login from '../components/Login.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'users',
      component: UsersView
    },
    {
      path: '/me',
      name: 'me',
      component: MeView
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView
    }
  ]
})

export default router
