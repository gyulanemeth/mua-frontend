import { defineStore } from 'pinia'

import infiniteListState from 'pinia-list-store/src/state/infinite.js'
import load from 'pinia-list-store/src/actions/load.js'
import loadMore from 'pinia-list-store/src/actions/loadMore.js'
import patchOne from 'pinia-list-store/src/actions/patchOne.js'

import useSystemMessagesStore from './systemMessages.js'

export default (connectors) => {
  const userStore = defineStore('users', {
    state: infiniteListState,
    actions: {
      load: load(connectors.list, useSystemMessagesStore().addError, { metaFirst: false }),
      loadMore: loadMore(connectors.list, useSystemMessagesStore().addError, { metaFirst: false }),
      patchRole: patchOne(connectors.patchRole, useSystemMessagesStore().addError, { optimistic: false }),
      async deleteOne ({ id, password, accountId }) {
        try {
          await connectors.deletePermission(password)
          const res = await connectors.deleteOne({ id, accountId })
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
