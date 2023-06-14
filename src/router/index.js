import { createRouter, createWebHistory } from 'vue-router'
import jwtDecode from 'jwt-decode'

import UserView from '../views/UserView.vue'
import MeView from '../views/MeView.vue'
import AccountView from '../views/AccountView.vue'
import FinalizeRegistrationView from '../views/FinalizeRegistrationView.vue'
import CreateAccountView from '../views/CreateAccountView.vue'
import LoginAndResetView from '../views/LoginAndResetView.vue'
import RedirectToLoginMessage from '../views/RedirectToLoginMessage.vue'

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
    },
    {
      path: '/redirectToLoginMessage',
      name: 'redirectToLoginMessage',
      component: RedirectToLoginMessage
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('accessToken') && to.path !== '/redirectToLoginMessage' && to.path !== '/login-select') {
    const decoded = jwtDecode(localStorage.getItem('accessToken'))
    const now = Date.now().valueOf() / 1000
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      localStorage.removeItem('accessToken')
      window.location.href = window.location.hostname + '/redirectToLoginMessage'
    }
  }

  if (!localStorage.getItem('accessToken') &&
  to.path !== '/forgot-password/reset' &&
  to.path !== '/forgot-password' &&
  to.path !== '/finalize-registration' &&
  to.path !== '/login-select' &&
  to.path !== '/invitation/accept' &&
  to.path !== '/create-account' &&
  to.path !== '/' &&
  to.path !== '/verify-email' &&
  to.path !== '/redirectToLoginMessage') {
    window.location.href = '/redirectToLoginMessage'
  } else next()
})

export default router
