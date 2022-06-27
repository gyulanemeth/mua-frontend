import { createRouter, createWebHistory } from 'vue-router'
import UserView from '../views/UserView.vue'
import MeView from '../views/MeView.vue'
import AccountView from '../views/AccountView.vue'
import SetAndReSetPasswordView from '../views/SetAndReSetPasswordView.vue'
import EmailAndNameFormView from '../views/EmailAndNameFormView.vue'
import Login from '../components/Login.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/users',
      name: 'users',
      component: UserView
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: EmailAndNameFormView
    },
    {
      path: '/me',
      name: 'me',
      component: MeView
    },
    {
      path: '/patchUserName',
      name: 'patchUserName',
      component: MeView
    },
    {
      path: '/patchPassword',
      name: 'patchPassword',
      component: MeView
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView
    },
    {
      path: '/patchAccountName',
      name: 'patchAccountName',
      component: AccountView
    },
    {
      path: '/patchUrlFriendlyName',
      name: 'patchUrlFriendlyName',
      component: AccountView
    }
  ]
})

export default router
