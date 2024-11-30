import { useAccountsStore } from '../stores/index.js'

import jwtDecode from 'jwt-decode'

import RedirectToLoginMessage from '../views/RedirectToLoginMessage.vue'
import UserView from '../views/UserView.vue'
import AccountUserProfileView from '../views/AccountUserProfileView.vue'
import AccountView from '../views/AccountView.vue'
import FinalizeRegistrationView from '../views/FinalizeRegistrationView.vue'
import CreateAccountView from '../views/CreateAccountView.vue'
import LoginAndResetView from '../views/LoginAndResetView.vue'
import AdminsAndAccountsView from '../views/AdminsAndAccountsView.vue'
import AdminForgotPasswordView from '../views/AdminForgotPasswordView.vue'
import SetAndReSetAdminPasswordView from '../views/SetAndReSetAdminPasswordView.vue'
import AdminLogin from '../components/AdminLogin.vue'
import AdminProfileView from '../views/AdminProfileView.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import AppLoading from '../components/AppLoading.vue'
import SystemAdmin from '../views/SystemAdmin.vue'
import NotFound from '../views/NotFound.vue'

const logout = (from, next) => {
  const decoded = jwtDecode(localStorage.getItem('accessToken'))
  const loginPageUrl = decoded.type === 'admin' ? '/system-admins/login' : `/accounts/login/${from.params.urlFriendlyName}`
  localStorage.removeItem('accessToken')
  localStorage.removeItem('accountId')
  next(loginPageUrl)
}

const checkToken = (to) => {
  if (!localStorage.getItem('accessToken') && to.meta.requiresAuth) {
    return '/accounts/login'
  } else if (localStorage.getItem('accessToken') && to.path !== '/redirect-to-login-message' && to.meta.requiresAuth) {
    const decoded = jwtDecode(localStorage.getItem('accessToken'))
    const now = Date.now().valueOf() / 1000
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      return '/redirect-to-login-message'
    }
  }
}

const checkUrlFriendlyName = async (to, next) => {
  if (localStorage.getItem('accountId') && to.meta.requiresAuth) {
    if (!useAccountsStore().account) {
      await useAccountsStore().readOne()
    }
    if (to.params.urlFriendlyName !== useAccountsStore().account?.urlFriendlyName) {
      to.params.urlFriendlyName = useAccountsStore().account.urlFriendlyName
      return next({ ...to, params: { ...to.params }, replace: true })
    }
  }
}

export const muaBeforeEach = async (to, from, next) => {
  const checkTokenRes = checkToken(to)
  if (checkTokenRes) {
    return next(checkTokenRes)
  }

  await checkUrlFriendlyName(to, next)

  if (to.path === '/logout') {
    logout(from, next)
  } else next()
}

export const useMuaRoutes = (router) => {
  router.addRoute({
    path: '/',
    redirect: { name: 'accounts-login' },
    name: 'defaultRoute'
  })
  router.addRoute({
    path: '/provider-auth',
    name: 'provider-auth',
    component: AppLoading,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/system-admins/login',
    name: 'system-admins-login',
    beforeEnter: async (to, from, next) => {
      if (!localStorage.getItem('accessToken')) {
        return next()
      }
      const decoded = jwtDecode(localStorage.getItem('accessToken'))
      const pageUrl = decoded.type === 'admin' ? '/system-admins/' : `/accounts/${from.params.urlFriendlyName}`
      next(pageUrl)
    },
    component: AdminLogin,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/system-admins/forgot-password',
    name: 'system-admins-forgot-password',
    component: AdminForgotPasswordView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/system-admins/forgot-password/reset',
    name: 'system-admins-forgot-password-reset',
    component: SetAndReSetAdminPasswordView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/system-admins/invitation/accept',
    name: 'system-admins-accept-invitation',
    component: SetAndReSetAdminPasswordView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/system-admins/verify-email',
    name: 'system-admins-verify-email',
    component: AdminProfileView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/system-admins',
    name: 'system-admins-main',
    beforeEnter: async (to, from, next) => {
      localStorage.removeItem('accountId')
      useAccountsStore().account = false
      next()
    },
    component: SystemAdmin,
    children: [
      {
        path: '',
        name: 'system-admins',
        component: AdminsAndAccountsView,
        meta: {
          requiresAuth: true,
          header: 'admins'
        }
      },
      {
        path: 'dashboard',
        name: 'admins-dashboard',
        component: AdminDashboard,
        meta: {
          requiresAuth: true,
          header: 'adminsDashboard'
        }
      },
      {
        path: 'accounts',
        name: 'system-admins-accounts',
        component: AdminsAndAccountsView,
        meta: {
          requiresAuth: true,
          header: 'accounts'
        }
      },
      {
        path: 'me',
        name: 'system-admins-me',
        component: AdminProfileView,
        meta: {
          requiresAuth: true,
          header: 'myProfile'
        }
      },
      {
        path: 'change-password',
        name: 'system-admins-changePassword',
        component: AdminProfileView,
        meta: {
          requiresAuth: true,
          header: 'myProfile'
        }
      },
      {
        path: 'change-email',
        name: 'system-admins-changeEmail',
        component: AdminProfileView,
        meta: {
          requiresAuth: true,
          header: 'myProfile'
        }
      },
      {
        path: 'settings',
        name: 'system-admins-settings',
        component: AdminProfileView,
        meta: {
          requiresAuth: true,
          header: 'myProfile'
        }
      },
      {
        path: ':id',
        name: 'system-admins-admin',
        component: AdminsAndAccountsView,
        meta: {
          requiresAuth: true
        }
      }
    ]
  })
  router.addRoute({
    path: '/accounts/login',
    name: 'accounts-login',
    beforeEnter: async (to, from, next) => {
      if (!localStorage.getItem('accessToken')) {
        return next()
      }
      const decoded = jwtDecode(localStorage.getItem('accessToken'))
      const pageUrl = decoded.type === 'admin' ? '/system-admins/' : `/accounts/${from.params.urlFriendlyName}`
      next(pageUrl)
    },
    component: LoginAndResetView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/accounts/login/:urlFriendlyName',
    name: 'accounts-loginWithUrlFriendlyName',
    component: LoginAndResetView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/accounts/login-select',
    name: 'accounts-login-select',
    component: LoginAndResetView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/accounts/finalize-registration',
    name: 'accounts-finalize-registration',
    component: FinalizeRegistrationView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/accounts/create-account',
    name: 'accounts-create-account',
    component: CreateAccountView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/accounts/create-password',
    name: 'accounts-create-password',
    component: LoginAndResetView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/accounts/forgot-password',
    name: 'accounts-forgot-password',
    component: LoginAndResetView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/accounts/verify-email',
    name: 'accounts-verify-email',
    component: AccountUserProfileView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/accounts/forgot-password/reset',
    name: 'accounts-forgot-password-reset',
    component: LoginAndResetView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/accounts/invitation/accept',
    name: 'accounts-accept-invitation',
    component: FinalizeRegistrationView,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/accounts',
    name: 'accounts',
    beforeEnter: async (to, from, next) => {
      if (localStorage.getItem('accessToken') && localStorage.getItem('accountId')) {
        if (!useAccountsStore().account) {
          await useAccountsStore().readOne()
        }
        next()
      } else {
        next('/system-admins/accounts')
      }
    },
    children: [
      {
        path: '',
        beforeEnter: async (to, from, next) => {
          const accountsStore = readOne()
          next(`/accounts/${accountsStore.account.urlFriendlyName}/dashboard`)
        },
        name: 'notFound'
      },
      {
        path: ':urlFriendlyName',
        redirect: { name: 'dashboard' },
        name: 'accounts-Default'
      },
      {
        path: ':urlFriendlyName/users',
        name: 'accounts-users',
        component: UserView,
        meta: {
          requiresAuth: true,
          header: 'users'
        }
      },
      {
        path: ':urlFriendlyName/me',
        name: 'accounts-me',
        component: AccountUserProfileView,
        beforeEnter: async (to, from, next) => {
          const decoded = jwtDecode(localStorage.getItem('accessToken'))
          if (decoded.type === 'admin') {
            return next('/system-admins/me')
          }
          next()
        },
        meta: {
          requiresAuth: true,
          header: 'myProfile'
        }
      },
      {
        path: ':urlFriendlyName/change-password',
        name: 'accounts-changePassword',
        component: AccountUserProfileView,
        meta: {
          requiresAuth: true,
          header: 'myProfile'
        }
      },
      {
        path: ':urlFriendlyName/add-password',
        name: 'accounts-add-password',
        component: AccountUserProfileView,
        meta: {
          requiresAuth: true,
          header: 'myProfile'
        }
      },
      {
        path: ':urlFriendlyName/change-email',
        name: 'accounts-changeEmail',
        component: AccountUserProfileView,
        meta: {
          requiresAuth: true,
          header: 'myProfile'
        }
      },
      {
        path: ':urlFriendlyName/settings',
        name: 'accounts-settings',
        component: AccountUserProfileView,
        meta: {
          requiresAuth: true,
          header: 'myProfile'
        }
      },
      {
        path: ':urlFriendlyName/account',
        name: 'accounts-account',
        component: AccountView,
        meta: {
          requiresAuth: true,
          header: 'account'
        }
      }
    ]
  })
  router.addRoute({
    path: '/redirect-to-login-message',
    name: 'redirectToLoginMessage',
    component: RedirectToLoginMessage,
    meta: {
      requiresAuth: false
    }
  })
  router.addRoute({
    path: '/:catchAll(.*)',
    name: 'notFound',
    component: NotFound,
    meta: {
      requiresAuth: false
    }
  })
}
