import { defineStore } from 'pinia'

import infiniteListState from 'pinia-list-store/src/state/infinite.js'
import jwtDecode from 'jwt-decode'

import useSystemMessagesStore from './systemMessages.js'

export default (connectors) => {
  const adminStore = defineStore('system-accounts-admins', {
    state: infiniteListState,
    actions: {
      async readOne () {
        try {
          const token = localStorage.getItem('accessToken')
          const tokenData = jwtDecode(token)
          const res = await connectors.admin.readOne({ id: tokenData.user._id })
          this.admin = res
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
