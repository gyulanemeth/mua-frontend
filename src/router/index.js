import { createRouter, createWebHistory } from 'vue-router'

import UserView from '../views/UserView.vue'
import MeView from '../views/MeView.vue'
import AccountView from '../views/AccountView.vue'
import FinalizeRegistrationView from '../views/FinalizeRegistrationView.vue'
import CreateAccountView from '../views/CreateAccountView.vue'
import LoginAndResetView from '../views/LoginAndResetView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/users',
      name: 'users',
      component: UserView
    },
    {
      path: '/',
      name: 'login',
      component: LoginAndResetView
    },
    {
      path: '/login-select',
      name: 'login-select',
      component: LoginAndResetView
    },
    {
      path: '/finalize-registration',
      name: 'finalize-registration',
      component: FinalizeRegistrationView
    },
    {
      path: '/create-account',
      name: 'create-account',
      component: CreateAccountView
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: LoginAndResetView
    },
    {
      path: '/me',
      name: 'me',
      component: MeView
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: MeView
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView
    },
    {
      path: '/forgot-password/reset',
      name: 'forgot-password-reset',
      component: LoginAndResetView
    },
    {
      path: '/invitation/accept',
      name: 'accept-invitation',
      component: FinalizeRegistrationView
    }
  ]
})

export default router
