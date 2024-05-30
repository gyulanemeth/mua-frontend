import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'

import RouteError from '../errors/RouteError.js'
import useSystemMessagesStore from './systemMessages.js'

export default (connectors) => {
  const router = useRouter() || [] // [] for test
  const storage = {}

  const query = new URLSearchParams(window.location.search)

  if (query.get('token') && query.get('accountId')) {
    localStorage.setItem('accessToken', query.get('token'))
    localStorage.setItem('accountId', query.get('accountId'))
  }

  const storedAccessToken = localStorage.getItem('accessToken')
  if (storedAccessToken) {
    if (query.get('token') && query.get('accountId')) {
      storage.account = { _id: query.get('accountId') }
    } else {
      storage.account = jwtDecode(storedAccessToken).account
    }
    storage.user = jwtDecode(storedAccessToken).user
    storage.accessToken = storedAccessToken
  }

  const currentUserAndAccountStore = defineStore('system-accounts-currentUserAndAccount', {
    state: () => ({
      accessToken: storage.accessToken,
      user: storage.user,
      account: storage.account
    }),
    getters: {
      loggedIn () {
        return !!this.accessToken
      },
      getAccountId () {
        if (this.account) {
          return this.account._id
        }
        const getToken = jwtDecode(localStorage.getItem('accessToken'))
        if (getToken.account && getToken.account._id) {
          return getToken.account._id
        }
        return localStorage.getItem('accountId')
      },
      checkAdmin () {
        return jwtDecode(localStorage.getItem('accessToken')).type === 'admin'
      }
    },
    actions: {
      async login (token, password, accountId) {
        try {
          localStorage.setItem('loginToken', token)
          const loginToken = await connectors.user.login({ password, accountId })
          const loginTokenData = jwtDecode(loginToken)
          this.accessToken = await connectors.user.getAccessToken({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.user = await connectors.user.readOne({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.account = await connectors.account.readOne({ id: loginTokenData.account._id })
          return { success: true }
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async loginWithUrlFriendlyName (params) {
        try {
          const loginToken = await connectors.user.loginWithUrlFriendlyName({ password: params.password, urlFriendlyName: params.urlFriendlyName, email: params.email })
          const loginTokenData = jwtDecode(loginToken)
          this.accessToken = await connectors.user.getAccessToken({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.user = await connectors.user.readOne({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.account = await connectors.account.readOne({ id: loginTokenData.account._id })
          return { success: true }
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async createAccount (formData) {
        try {
          const res = await connectors.account.createOne(formData)
          return { ...res, success: true }
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
        if (jwtDecode(localStorage.getItem('accessToken')).type === 'admin') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('accountId')
          window.location.href = `${window.config.appBaseUrl}me?logout=true`
        } else {
          router.push('/system-accounts/' + window.location.pathname.split('/')[1])
        }
        localStorage.removeItem('accessToken')
        localStorage.removeItem('loginToken')
        this.accessToken = null
        this.user = null
        this.account = null
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
          const loginToken = await connectors.forgotPassword.reset({ id: forgotPasswordTokenData.account._id, token: forgotPasswordToken, newPassword, newPasswordAgain })
          const loginTokenData = jwtDecode(loginToken)
          this.accessToken = await connectors.user.getAccessToken({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.user = await connectors.user.readOne({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.account = await connectors.account.readOne({ id: loginTokenData.account._id })
          localStorage.setItem('accountId', this.account._id)
          router.push(`/system-accounts/${this.account.urlFriendlyName}/me`)
          return true
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
          const res = await connectors.invitation.send({ email, id: this.account._id })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },

      async reSendInvitation (email) {
        try {
          if (this.account === null || this.account._id === undefined) {
            throw new RouteError('account ID Is Required')
          }
          const res = await connectors.invitation.reSend({ email, id: this.account._id })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async acceptInvitation (acceptInvitationToken, newPassword, newPasswordAgain, name) {
        try {
          const acceptInvitationTokenData = jwtDecode(acceptInvitationToken)
          const loginToken = await connectors.invitation.accept({ id: acceptInvitationTokenData.account._id, token: acceptInvitationToken, newPassword, newPasswordAgain, name })
          const loginTokenData = jwtDecode(loginToken)
          this.accessToken = await connectors.user.getAccessToken({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.user = await connectors.user.readOne({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.account = await connectors.account.readOne({ id: loginTokenData.account._id })
          localStorage.setItem('accountId', this.account._id)
          router.push(`/system-accounts/${this.account.urlFriendlyName}/me`)
          return true
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async readOne () {
        try {
          if (localStorage.getItem('accessToken') && jwtDecode(localStorage.getItem('accessToken')).type === 'admin') {
            this.account = { _id: localStorage.getItem('accountId') }
          }
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
          if (localStorage.getItem('accessToken') && jwtDecode(localStorage.getItem('accessToken')).type === 'admin') {
            if (window.location.pathname.split('/').includes('me')) {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('accountId')
              window.location.href = `${window.config.appBaseUrl}me`
            } else {
              const tokenData = jwtDecode(localStorage.getItem('accessToken'))
              this.user = tokenData.user
              this.user.role = tokenData.type
            }
            return this.user
          }
          if (!this.user || !this.account || !this.user._id || !this.account._id) {
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
          router.push(`/system-accounts/${this.account.urlFriendlyName}/me`)
          return true
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
          router.push(`/system-accounts/${this.account.urlFriendlyName}/account`)
          return true
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
          router.push(`/system-accounts/${this.account.urlFriendlyName}/account`)
          return true
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
          return { success: true }
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async reSendFinalizeRegistration ({ accountId, userId }) {
        try {
          if (accountId === null || userId === undefined) {
            throw new RouteError('User ID and Account ID Is Required')
          }
          const res = await connectors.user.reSendfinalizeRegistrationEmail({ userId, accountId })
          return { ...res, success: true }
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
          const loginToken = await connectors.account.finalizeRegistration({ id: tokenData.user._id, accountId: tokenData.account._id, token })
          const loginTokenData = jwtDecode(loginToken)
          this.accessToken = await connectors.user.getAccessToken({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.user = await connectors.user.readOne({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.account = await connectors.account.readOne({ id: loginTokenData.account._id })
          localStorage.setItem('accountId', this.account._id)
          router.push('/system-accounts')
          return { success: true }
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },

      async patchEmail (newEmail, newEmailAgain) {
        try {
          if (!this.user || !this.user._id || !this.account || !this.account._id) {
            throw new RouteError('User ID And Account ID Is Required')
          }
          const res = await connectors.user.patchEmail({ id: this.user._id, accountId: this.account._id, newEmail, newEmailAgain })
          router.push(`/system-accounts/${this.account.urlFriendlyName}/me`)
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async patchEmailConfirm (token) {
        try {
          const tokenData = jwtDecode(token)
          if (!tokenData || !tokenData.user || !tokenData.user._id || !tokenData.account || !tokenData.account._id) {
            throw new RouteError('Valid Token Is Required')
          }
          const res = await connectors.user.patchEmailConfirm({ id: tokenData.user._id, accountId: tokenData.account._id, token })
          router.push(`/system-accounts/${tokenData.account.urlFriendlyName}/`)
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async uploadUserProfilePicture (formData) {
        try {
          const res = await connectors.user.uploadProfilePicture({ accountId: this.account._id, id: this.user._id }, formData)
          this.user.profilePicture = res.profilePicture
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async deleteUserProfilePicture () {
        try {
          const res = await connectors.user.deleteProfilePicture({ accountId: this.account._id, id: this.user._id })
          delete this.user.profilePicture
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async uploadLogo (formData) {
        try {
          const res = await connectors.account.uploadLogo({ id: this.account._id }, formData)
          this.account.logo = res.logo
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async deleteLogo () {
        try {
          const res = await connectors.account.deleteLogo({ id: this.account._id })
          delete this.account.logo
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async deleteAccount (password) {
        try {
          await connectors.user.deletePermission(password)
          const res = await connectors.account.deleteOne({ id: this.account._id })
          if (jwtDecode(localStorage.getItem('accessToken')).type === 'admin') {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('accountId')
            router.push('/system-admins/')
          } else {
            router.push('/system-accounts/')
            localStorage.removeItem('accountId')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('loginToken')
          }
          this.accessToken = null
          this.user = null
          this.account = null
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async getAccountByUrlFriendlyName (urlFriendlyName) {
        try {
          const res = await connectors.account.getAccountByUrlFriendlyName({ urlFriendlyName })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      }
    }
  })

  return currentUserAndAccountStore
}
