import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

import infiniteListState from 'pinia-list-store/src/state/infinite.js'
import load from 'pinia-list-store/src/actions/load.js'
import loadMore from 'pinia-list-store/src/actions/loadMore.js'
import deleteAdmin from 'pinia-list-store/src/actions/deleteOne.js'
import jwtDecode from 'jwt-decode'

import RouteError from '../errors/RouteError.js'
import useSystemMessagesStore from './systemMessages.js'

export default (connectors) => {
  const router = useRouter() || [] // [] for testing

  const storage = {}

  const storedAccessToken = localStorage.getItem('accessToken')
  if (storedAccessToken) {
    storage.user = jwtDecode(storedAccessToken).user
    storage.accessToken = storedAccessToken
    if (window.location.pathname === '/system-admins') {
      router.push('/system-admins')
    }
  }

  const adminStore = defineStore('mua-frontend-admins', {
    state: () => ({
      accessToken: storage.accessToken,
      user: storage.user,
      ...infiniteListState()
    }),
    actions: {
      load: load(connectors.admins.list, useSystemMessagesStore().addError, { metaFirst: false }),
      loadMore: loadMore(connectors.admins.list, useSystemMessagesStore().addError, { metaFirst: false }),
      delete: deleteAdmin(connectors.admins.deleteOne, useSystemMessagesStore().addError, { optimistic: false }),
      async deleteOne ({ id, password }) {
        try {
          await connectors.admins.deletePermission(password)
          const res = await connectors.admins.deleteOne({ id, password })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async login (email, password) {
        try {
          const token = await connectors.admins.login({ email, password })
          if (token.twoFactorLoginToken) {
            return { twoFactorEnabled: true }
          }
          const loginTokenData = jwtDecode(token.loginToken)
          this.accessToken = await connectors.admins.getAccessToken({ id: loginTokenData.user._id })
          this.user = await connectors.admins.readOne({ id: loginTokenData.user._id })
          router.push('/system-admins')
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async MFALogin (params) {
        try {
          const loginToken = await connectors.admins.MFALogin(params)
          const loginTokenData = jwtDecode(loginToken)
          this.accessToken = await connectors.admins.getAccessToken({ id: loginTokenData.user._id })
          this.user = await connectors.admins.readOne({ id: loginTokenData.user._id })
          router.push('/system-admins')
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async getMFA () {
        try {
          const res = await connectors.admins.getMFA({ id: this.user._id })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async disableMFA () {
        try {
          const res = await connectors.admins.disableMFA({ id: this.user._id })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async confirmMFA (code) {
        try {
          const res = await connectors.admins.confirmMFA({ id: this.user._id }, { code })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      logout () {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('loginToken')
        this.accessToken = null
        this.user = null
        router.push('/system-admins/login')
      },

      async sendForgotPassword (data) {
        try {
          const res = await connectors.forgotPassword.send(data)
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async getAccessToken (loginToken) {
        try {
          const loginTokenData = jwtDecode(loginToken)
          this.accessToken = await connectors.admins.getAccessToken({ id: loginTokenData.user._id })
          this.user = await connectors.admins.readOne({ id: loginTokenData.user._id })
          return { success: true }
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async loginWithProvider () {
        try {
          const res = await connectors.admins.loginWithProvider()
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async linkToProvider ({ id, provider }) {
        try {
          const res = await connectors.admins.linkToProvider({ id, provider })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async disconnectProvider ({ id, password, provider }) {
        try {
          await connectors.admins.disconnectPermission(password)
          const res = await connectors.admins.disconnectProvider({ id, provider })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async resetForgotPassword (forgotPasswordToken, newPassword, newPasswordAgain) {
        try {
          const resetPasswordToken = await connectors.forgotPassword.reset({ token: forgotPasswordToken, newPassword, newPasswordAgain })
          const resetPasswordTokenData = jwtDecode(resetPasswordToken)
          this.accessToken = await connectors.admins.getAccessToken({ id: resetPasswordTokenData.user._id })
          this.user = await connectors.admins.readOne({ id: resetPasswordTokenData.user._id })
          return 'success'
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },

      async sendInvitation (email) {
        try {
          const res = await connectors.invitation.send({ email })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async reSendInvitation (email) {
        try {
          const res = await connectors.invitation.reSend({ email })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async acceptInvitation (acceptInvitationToken, newPassword, newPasswordAgain, name) {
        try {
          const invitationToken = await connectors.invitation.accept({ token: acceptInvitationToken, newPassword, newPasswordAgain, name })
          const invitationTokenData = jwtDecode(invitationToken)
          this.accessToken = await connectors.admins.getAccessToken({ id: invitationTokenData.user._id })
          this.user = await connectors.admins.readOne({ id: invitationTokenData.user._id })
          router.push('/system-admins')
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async refreshAccessToken () { // email
        try {
          if (!this.user || !this.user._id) {
            throw new RouteError('Admin ID Is Required')
          }
          this.accessToken = await connectors.admins.getAccessToken({ id: this.user._id })
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async patchName (name) {
        try {
          if (!this.user || !this.user._id) {
            throw new RouteError('Admin ID Is Required')
          }
          await connectors.admins.patchName({ id: this.user._id, name })
          this.user.name = name
          return name
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async patchPassword (oldPassword, newPassword, newPasswordAgain) {
        try {
          if (!this.user || !this.user._id) {
            throw new RouteError('Admin ID Is Required')
          }
          await connectors.admins.patchPassword({ id: this.user._id, oldPassword, newPassword, newPasswordAgain })
          return 'success'
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async patchEmail (newEmail, newEmailAgain) {
        try {
          if (!this.user || !this.user._id) {
            throw new RouteError('Admin ID Is Required')
          }
          const res = await connectors.admins.patchEmail({ id: this.user._id, newEmail, newEmailAgain })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async patchEmailConfirm (token) {
        try {
          const tokenData = jwtDecode(token)
          if (!tokenData || !tokenData.user || !tokenData.user._id) {
            throw new RouteError('Valid Token Is Required')
          }
          const res = await connectors.admins.patchEmailConfirm({ id: tokenData.user._id, token })
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async readOne () {
        try {
          if (!this.user || !this.user._id) {
            throw new RouteError('Admin ID Is Required')
          }
          this.user = await connectors.admins.readOne({ id: this.user._id })
          return this.user
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async uploadProfilePicture (formData) {
        try {
          const res = await connectors.admins.uploadProfilePicture({ id: this.user._id }, formData)
          this.user.profilePicture = res.profilePicture
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async deleteProfilePicture () {
        try {
          const res = await connectors.admins.deleteProfilePicture({ id: this.user._id })
          delete this.user.profilePicture
          return res
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      }
    }
  })

  return adminStore
}
