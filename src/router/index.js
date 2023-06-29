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
      path: '/:urlFriendlyName/users',
      name: 'users',
      component: UserView
    },
    {
      path: '/',
      name: 'login',
      component: LoginAndResetView
    },
    {
      path: '/:urlFriendlyName',
      name: 'loginWithUrlFriendlyName',
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
      path: '/:urlFriendlyName/me',
      name: 'me',
      component: MeView
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: MeView
    },
    {
      path: '/:urlFriendlyName/account',
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
      path: '/:urlFriendlyName/redirectToLoginMessage',
      name: 'redirectToLoginMessage',
      component: RedirectToLoginMessage
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('accessToken') && to.name !== 'redirectToLoginMessage' && to.name !== 'login-select') {
    const decoded = jwtDecode(localStorage.getItem('accessToken'))
    const now = Date.now().valueOf() / 1000
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      localStorage.removeItem('accessToken')
      window.location.href = window.location.hostname + '/redirectToLoginMessage'
      return 'done'
    }
  }
  if (localStorage.getItem('accessToken') && (to.name === 'login' || to.name === 'loginWithUrlFriendlyName')) {
    if (to.query.logout) {
      if (jwtDecode(localStorage.getItem('accessToken')).type === 'admin') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('accountId')
        window.location.href = `${window.config.adminsAppBaseUrl}me?logout=true`
        return 'done'
      } else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('loginToken')
        return next({ path: `/${to.params.urlFriendlyName}/` })
      }
    } 
    return next({ path: `/${to.params.urlFriendlyName}/users` })
  }

  if (to.name === 'create-account' && localStorage.getItem('accessToken')) {
    return next({ path: '/' + to.params.urlFriendlyName + '/users' })
  }

  if (!localStorage.getItem('accessToken') &&
    to.name !== 'forgot-password-reset' &&
    to.name !== 'forgot-password' &&
    to.name !== 'finalize-registration' &&
    to.name !== 'login-select' &&
    to.name !== 'accept-invitation' &&
    to.name !== 'create-account' &&
    to.name !== 'login' &&
    to.name !== 'loginWithUrlFriendlyName' &&
    to.name !== 'verify-email' &&
    to.name !== 'redirectToLoginMessage') {
    if (to.params.urlFriendlyName) {
      window.location.href = '/' + to.params.urlFriendlyName + '/redirectToLoginMessage'
    } else {
      window.location.href = '/'
    }
  } else next()
})

export default router
