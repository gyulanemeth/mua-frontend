import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'

import infiniteListState from 'pinia-list-store/src/state/infinite.js'
import load from 'pinia-list-store/src/actions/load.js'
import loadMore from 'pinia-list-store/src/actions/loadMore.js'

import RouteError from '../errors/RouteError.js'
import useSystemMessagesStore from './systemMessages.js'

export default (connectors) => {
  const router = useRouter() || [] // [] for test
  const storage = {}

  const storedAccessToken = localStorage.getItem('accessToken')
  if (storedAccessToken) {
    storage.account = jwtDecode(storedAccessToken).account
  }

  async function updateRecentLogins (account, newUrlFriendlyName) {
    let recentLogins = localStorage.getItem('recentLogins')
    const accountData = {
      name: account.name,
      urlFriendlyName: newUrlFriendlyName || account.urlFriendlyName,
      logo: account.logo
    }
    if (!recentLogins) {
      localStorage.setItem('recentLogins', JSON.stringify([accountData]))
    } else {
      recentLogins = JSON.parse(recentLogins)
      const checkIndex = recentLogins.findIndex(element => element.urlFriendlyName === account.urlFriendlyName)
      if (checkIndex >= 0) {
        recentLogins.splice(checkIndex, 1)
      }
      recentLogins.push(accountData)
      localStorage.setItem('recentLogins', JSON.stringify(recentLogins))
    }
  }

  const accountStore = defineStore('mua-frontend-accountsStore', {
    state: infiniteListState,
    actions: {
      load: load(connectors.account.list, useSystemMessagesStore().addError, { metaFirst: false }),
      loadMore: loadMore(connectors.account.list, useSystemMessagesStore().addError, { metaFirst: false }),
      async createOneByAdmin (formData) {
        try {
          const logo = formData.logo
          const accountData = await connectors.account.createOneByAdmin(formData)
          if (logo) {
            await connectors.account.uploadLogo({ id: accountData._id }, logo)
          }
          return 'success'
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
      async readOne () {
        try {
          if (localStorage.getItem('accountId')) {
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
      async patchAccountName ({ user, name }) {
        try {
          if (this.account === null || this.account._id === undefined || user === null || user._id === undefined) {
            throw new RouteError('User ID Is Required')
          }
          await connectors.account.patchName({ id: this.account._id, name })
          this.account.name = name
          updateRecentLogins(this.account)
          router.push(`/accounts/${this.account.urlFriendlyName}/account`)
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
          const oldAccountData = { ...this.account }
          this.account.urlFriendlyName = newUrlFriendlyName
          updateRecentLogins(oldAccountData, newUrlFriendlyName)
          router.push(`/accounts/${this.account.urlFriendlyName}/account`)
          return true
        } catch (e) {
          useSystemMessagesStore().addError(e)
          return e
        }
      },
      async uploadLogo (formData) {
        try {
          const res = await connectors.account.uploadLogo({ id: this.account._id }, formData)
          this.account.logo = res.logo
          updateRecentLogins(this.account)
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
          updateRecentLogins(this.account)
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
            localStorage.removeItem('accountId')
            this.account = null
            router.push('/system-admins/')
          } else {
            this.account = null
            localStorage.removeItem('accountId')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('loginToken')
            router.push('/accounts/')
          }
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
  return accountStore
}
