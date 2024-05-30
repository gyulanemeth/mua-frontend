import { createRouter, createWebHistory } from 'vue-router'
import jwtDecode from 'jwt-decode'

import UserView from '../views/UserView.vue'
import MeView from '../views/MeView.vue'
import AccountView from '../views/AccountView.vue'
import FinalizeRegistrationView from '../views/FinalizeRegistrationView.vue'
import CreateAccountView from '../views/CreateAccountView.vue'
import LoginAndResetView from '../views/LoginAndResetView.vue'
import RedirectToLoginMessage from '../views/RedirectToLoginMessage.vue'
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/system-accounts/:urlFriendlyName/users',
      name: 'system-accounts-users',
      component: UserView,
      meta: {
        requiresAuth: true,
        header: 'users'
      }
    },
    {
      path: '/system-accounts/',
      name: 'system-accounts-login',
      component: LoginAndResetView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/system-accounts/:urlFriendlyName',
      name: 'system-accounts-loginWithUrlFriendlyName',
      component: LoginAndResetView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/system-accounts/login-select',
      name: 'system-accounts-login-select',
      component: LoginAndResetView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/system-accounts/finalize-registration',
      name: 'system-accounts-finalize-registration',
      component: FinalizeRegistrationView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/system-accounts/create-account',
      name: 'system-accounts-create-account',
      component: CreateAccountView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/system-accounts/forgot-password',
      name: 'system-accounts-forgot-password',
      component: LoginAndResetView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/system-accounts/:urlFriendlyName/me',
      name: 'system-accounts-me',
      component: MeView,
      meta: {
        requiresAuth: true,
        header: 'myProfile'
      }
    },
    {
      path: '/system-accounts/:urlFriendlyName/change-password',
      name: 'system-accounts-changePassword',
      component: MeView,
      meta: {
        requiresAuth: true,
        header: 'myProfile'
      }
    },
    {
      path: '/system-accounts/:urlFriendlyName/change-email',
      name: 'system-accounts-changeEmail',
      component: MeView,
      meta: {
        requiresAuth: true,
        header: 'myProfile'
      }
    },
    {
      path: '/system-accounts/:urlFriendlyName/settings',
      name: 'system-accounts-settings',
      component: MeView,
      meta: {
        requiresAuth: true,
        header: 'myProfile'
      }
    },
    {
      path: '/system-accounts/verify-email',
      name: 'system-accounts-verify-email',
      component: MeView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/system-accounts/:urlFriendlyName/account',
      name: 'system-accounts-account',
      component: AccountView,
      meta: {
        requiresAuth: true,
        header: 'account'
      }
    },
    {
      path: '/system-accounts/forgot-password/reset',
      name: 'system-accounts-forgot-password-reset',
      component: LoginAndResetView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/system-accounts/invitation/accept',
      name: 'system-accounts-accept-invitation',
      component: FinalizeRegistrationView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/system-accounts/:urlFriendlyName/redirect-to-login-message',
      name: 'system-accounts-redirectToLoginMessage',
      component: RedirectToLoginMessage,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: NotFoundView,
      meta: {
        requiresAuth: false
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const store = useCurrentUserAndAccountStore()
  if (to.params.urlFriendlyName && to.params.urlFriendlyName === 'undefined') {
    await store.readOne()
    next({ path: to.path.replace('undefined', store.account.urlFriendlyName) })
  }
  if (localStorage.getItem('accessToken') && to.name !== 'redirectToLoginMessage' && to.name !== 'login-select') {
    const decoded = jwtDecode(localStorage.getItem('accessToken'))
    const now = Date.now().valueOf() / 1000
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      localStorage.clear()
      return next({ path: `${to.params.urlFriendlyName ? '/' + to.params.urlFriendlyName : ''}/redirect-to-login-message` })
    }
    if (!store.account) {
      await store.readOne()
    }
  }
  if (localStorage.getItem('accessToken') && (to.name === 'login' || to.name === 'loginWithUrlFriendlyName')) {
    if (to.query.logout) {
      if (jwtDecode(localStorage.getItem('accessToken')).type === 'admin') {
        localStorage.clear()
        window.location.href = `${window.config.appBaseUrl}me?logout=true`
        return
      } else {
        localStorage.clear()
        return next({ path: `/${to.params.urlFriendlyName}/` })
      }
    }
    return next({ path: `/${to.params.urlFriendlyName}/users` })
  }

  if (to.name === 'create-account' && localStorage.getItem('accessToken')) {
    const tokenData = jwtDecode(localStorage.getItem('accessToken'))
    if (tokenData.type === 'admin') {
      localStorage.clear()
      window.location.href = `${window.config.appBaseUrl}accounts`
      return
    }
    return next({ path: '/system-accounts/' + tokenData.account.urlFriendlyName + '/users' })
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
      window.location.href = '/system-accounts/' + to.params.urlFriendlyName + '/redirect-to-login-message'
    } else {
      window.location.href = '/system-accounts'
    }
  } else next()
})

export default router
