import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'

import RouteError from '../errors/RouteError.js'
import useSystemMessagesStore from './systemMessages.js'

export default (connectors) => {
  const router = useRouter() || [] // [] for test

  const storage = {}

  const storedAccessToken = localStorage.getItem('accessToken')
  if (!storedAccessToken || Date.now() >= jwtDecode(storedAccessToken).exp * 1000) {
    if (window.location.pathname !== '/forgot-password/reset' &&
     window.location.pathname !== '/forgot-password' &&
     window.location.pathname !== '/finalize-registration' &&
     window.location.pathname !== '/loginSelect' &&
     window.location.pathname !== '/invitation/accept' &&
     window.location.pathname !== '/createAccount' &&
     window.location.pathname !== '/') {
      router.push('/')
    }
  } else {
    storage.user = jwtDecode(storedAccessToken).user
    storage.account = jwtDecode(storedAccessToken).account
    storage.accessToken = storedAccessToken
    if (window.location.pathname === '/') {
      router.push('/users')
    }
  }

  const currentUserAndAccountStore = defineStore('currentUserAndAccount', {
    state: () => ({
      accessToken: storage.accessToken,
      user: storage.user,
      account: storage.account
    }),
    getters: {
      loggedIn () {
        return !!this.account
      }
    },
    actions: {
      async login (token, password, accountId) {
        try {
          localStorage.setItem('accessToken', token)
          this.accessToken = await connectors.user.login({ password, accountId })
          const tokenData = jwtDecode(this.accessToken)
          this.accessToken = await connectors.user.getAccessToken({ id: tokenData.user._id, accountId: tokenData.account._id })
          this.user = await connectors.user.readOne({ id: tokenData.user._id, accountId: tokenData.account._id })
          this.account = await connectors.account.readOne({ id: tokenData.account._id })
          router.push('/me')
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async createAccount (formData) {
        try {
          await connectors.account.createOne(formData)
          router.push('/')
          return { success: true }
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async loginGetAccounts (email) {
        try {
          const res = await connectors.user.loginGetAccounts({ email })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      logout () {
        localStorage.removeItem('accessToken')
        this.accessToken = null
        this.user = null
        this.account = null
        router.push('/')
      },

      async  sendForgotPassword (data) {
        try {
          if (!data || !data.email || !data.accountId) {
            throw new RouteError('account Id and email Is Required')
          }
          const res = await connectors.forgotPassword.send({ email: data.email, id: data.accountId })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },

      async  resetForgotPassword (forgotPasswordToken, newPassword, newPasswordAgain) {
        try {
          const forgotPasswordTokenData = jwtDecode(forgotPasswordToken)
          if (!forgotPasswordToken || !forgotPasswordTokenData || Date.now() >= forgotPasswordTokenData.exp * 1000 || !newPassword || !newPasswordAgain) {
            throw new RouteError('Valid token, password and new password Is Required')
          }
          this.accessToken = await connectors.forgotPassword.reset({ id: forgotPasswordTokenData.user.accountId, token: forgotPasswordToken, newPassword, newPasswordAgain })
          const tokenData = jwtDecode(this.accessToken)
          this.accessToken = await connectors.user.getAccessToken({ id: tokenData.user._id, accountId: tokenData.user.accountId })
          this.user = await connectors.user.readOne({ id: tokenData.user._id, accountId: tokenData.user._id })
          router.push('/me')
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },

      async sendInvitation (email) {
        try {
          if (this.account === null || this.account._id === undefined) {
            throw new RouteError('account ID Is Required')
          }
          await connectors.invitation.send({ email, id: this.account._id })
          router.push('/users')
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async acceptInvitation (acceptInvitationToken, newPassword, newPasswordAgain, name) {
        try {
          if (this.account === null || this.account._id === undefined) {
            throw new RouteError('account ID Is Required')
          }
          this.accessToken = await connectors.invitation.accept({ id: this.account._id, token: acceptInvitationToken, newPassword, newPasswordAgain, name })
          const tokenData = jwtDecode(this.accessToken)
          this.accessToken = await connectors.user.getAccessToken({ id: tokenData.user._id, accountId: tokenData.user.accountId })
          this.user = await connectors.user.readOne({ id: tokenData.user._id, accountId: tokenData.user._id })
          router.push('/me')
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async readOne () {
        try {
          if (this.account === null || this.account._id === undefined) {
            throw new RouteError('account ID Is Required')
          }
          this.account = await connectors.account.readOne({ id: this.account._id })
          return this.account
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async readOneUser () {
        try {
          if (this.user === null || this.account === null || this.user._id === undefined || this.account._id === undefined) {
            throw new RouteError('user ID Is Required')
          }
          this.user = await connectors.user.readOne({ id: this.user._id, accountId: this.account._id })
          return this.user
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async patchUserName (name) {
        try {
          if (this.account === null || this.account._id === undefined || this.user === null || this.user._id === undefined) {
            throw new RouteError('User ID Is Required')
          }
          await connectors.user.patchName({ id: this.user._id, name, accountId: this.account._id })
          this.user.name = name
          router.push('/me')
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async patchAccountName (name) {
        try {
          if (this.account === null || this.account._id === undefined || this.user === null || this.user._id === undefined) {
            throw new RouteError('User ID Is Required')
          }
          await connectors.account.patchName({ id: this.account._id, name })
          this.account.name = name
          router.push('/account')
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async patchUrlFriendlyName (newUrlFriendlyName) {
        try {
          if (this.account === null || this.account._id === undefined) {
            throw new RouteError('account ID Is Required')
          }
          await connectors.account.patchUrlFriendlyName({ id: this.account._id, urlFriendlyName: newUrlFriendlyName })
          this.account.urlFriendlyName = newUrlFriendlyName
          router.push('/account')
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async patchPassword (oldPassword, newPassword, newPasswordAgain) {
        try {
          if (this.user === null || this.user._id === undefined || this.account === undefined || this.account._id === undefined) {
            throw new RouteError('Admin ID Is Required')
          }
          await connectors.user.patchPassword({ accountId: this.account._id, id: this.user._id, oldPassword, newPassword, newPasswordAgain })
          router.push('/me')
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async finalizeRegistration (token) {
        try {
          const tokenData = jwtDecode(token)
          if (!token || !tokenData || Date.now() >= tokenData.exp * 1000) {
            throw new RouteError('Valid Token Is Required')
          }
          this.user = await connectors.account.finalizeRegistration({ id: tokenData.user._id, accountId: tokenData.account._id, token })
          router.push('/')
          return { success: true }
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      }
    }
  })

  return currentUserAndAccountStore
}
