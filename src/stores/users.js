import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'

import infiniteListState from 'pinia-list-store/src/state/infinite.js'
import load from 'pinia-list-store/src/actions/load.js'
import loadMore from 'pinia-list-store/src/actions/loadMore.js'
import patchOne from 'pinia-list-store/src/actions/patchOne.js'

import RouteError from '../errors/RouteError.js'
import useSystemMessagesStore from './systemMessages.js'

export default (connectors) => {
  const router = useRouter() || [] // [] for test
  const storage = {}

  const storedAccessToken = localStorage.getItem('accessToken')
  if (storedAccessToken) {
    storage.user = jwtDecode(storedAccessToken).user
    storage.accessToken = storedAccessToken
  }

  const userStore = defineStore('mua-frontend-users', {
    state: () => ({
      accessToken: storage.accessToken,
      user: storage.user,
      ...infiniteListState()
    }),
    actions: {
      load: load(connectors.user.list, useSystemMessagesStore().addError, { metaFirst: false }),
      loadMore: loadMore(connectors.user.list, useSystemMessagesStore().addError, { metaFirst: false }),
      patchRole: patchOne(connectors.user.patchRole, useSystemMessagesStore().addError, { optimistic: false }),
      async deleteOne ({ id, password, accountId }) {
        try {
          await connectors.user.deletePermission(password)
          const res = await connectors.user.deleteOne({ id, accountId })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async login (token, password, accountId) {
        try {
          localStorage.setItem('loginToken', token)
          const loginToken = await connectors.user.login({ password, accountId })
          const loginTokenData = jwtDecode(loginToken)
          this.accessToken = await connectors.user.getAccessToken({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.user = await connectors.user.readOne({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          localStorage.setItem('accountId', loginTokenData.account._id)
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
          localStorage.setItem('accountId', loginTokenData.account._id)
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
        router.push('/accounts/' + window.location.pathname.split('/')[1])
        localStorage.removeItem('accessToken')
        localStorage.removeItem('accountId')
        localStorage.removeItem('loginToken')
        this.accessToken = null
        this.user = null
      },
      async sendForgotPassword (data) {
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
      async resetForgotPassword (forgotPasswordToken, newPassword, newPasswordAgain) {
        try {
          const forgotPasswordTokenData = jwtDecode(forgotPasswordToken)
          if (!forgotPasswordToken || !forgotPasswordTokenData || Date.now() >= forgotPasswordTokenData.exp * 1000 || !newPassword || !newPasswordAgain) {
            throw new RouteError('Valid token, password and new password Is Required')
          }
          const loginToken = await connectors.forgotPassword.reset({ id: forgotPasswordTokenData.account._id, token: forgotPasswordToken, newPassword, newPasswordAgain })
          const loginTokenData = jwtDecode(loginToken)
          this.accessToken = await connectors.user.getAccessToken({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          this.user = await connectors.user.readOne({ id: loginTokenData.user._id, accountId: loginTokenData.account._id })
          localStorage.setItem('accountId', loginTokenData.account._id)
          router.push(`/accounts/`)
          return true
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async sendInvitation (email) {
        try {
          if (!localStorage.getItem('accountId')) {
            throw new RouteError('account ID Is Required')
          }
          const res = await connectors.invitation.send({ email, id: localStorage.getItem('accountId') })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async reSendInvitation (email) {
        try {
          if (!localStorage.getItem('accountId')) {
            throw new RouteError('account ID Is Required')
          }
          const res = await connectors.invitation.reSend({ email, id: localStorage.getItem('accountId') })
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
          localStorage.setItem('accountId', loginTokenData.account._id)
          router.push(`/accounts`)
          return true
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async readOne () {
        try {
          if (localStorage.getItem('accessToken') && jwtDecode(localStorage.getItem('accessToken')).type === 'admin') {
            if (window.location.pathname.split('/').includes('me')) {
              localStorage.removeItem('accountId')
              window.location.href = `${window.config.appBaseUrl}me`
            } else {
              const tokenData = jwtDecode(localStorage.getItem('accessToken'))
              this.user = tokenData.user
              this.user.role = tokenData.type
            }
            return this.user
          }
          if (!this.user || !this.user._id || !localStorage.getItem('accountId')) {
            throw new RouteError('user ID Is Required')
          }

          this.user = await connectors.user.readOne({ id: this.user._id, accountId: localStorage.getItem('accountId') })
          return this.user
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async patchUserName (name) {
        try {
          if (this.user === null || this.user._id === undefined) {
            throw new RouteError('User ID Is Required')
          }
          await connectors.user.patchName({ id: this.user._id, name, accountId: localStorage.getItem('accountId') })
          this.user.name = name
          return true
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async patchPassword (oldPassword, newPassword, newPasswordAgain) {
        try {
          if (this.user === null || this.user._id === undefined || !localStorage.getItem('accountId')) {
            throw new RouteError('Admin ID Is Required')
          }
          await connectors.user.patchPassword({ accountId: localStorage.getItem('accountId'), id: this.user._id, oldPassword, newPassword, newPasswordAgain })
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
          localStorage.setItem('accountId', loginTokenData.account._id)
          return { success: true }
        } catch (e) {
          return e
        }
      },
      async patchEmail (newEmail, newEmailAgain) {
        try {
          if (!this.user || !this.user._id || !localStorage.getItem('accountId')) {
            throw new RouteError('User ID And Account ID Is Required')
          }
          const res = await connectors.user.patchEmail({ id: this.user._id, accountId: localStorage.getItem('accountId'), newEmail, newEmailAgain })
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
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async uploadProfilePicture (formData) {
        try {
          const res = await connectors.user.uploadProfilePicture({ accountId: localStorage.getItem('accountId'), id: this.user._id }, formData)
          this.user.profilePicture = res.profilePicture
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async deleteProfilePicture () {
        try {
          const res = await connectors.user.deleteProfilePicture({ accountId: localStorage.getItem('accountId'), id: this.user._id })
          delete this.user.profilePicture
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      }
    }
  })

  return userStore
}
