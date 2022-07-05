import { defineStore } from 'pinia'

import infiniteListState from 'pinia-list-store/src/state/infinite.js'
import deleteOne from 'pinia-list-store/src/actions/deleteOne.js'
import load from 'pinia-list-store/src/actions/load.js'
import patchOne from 'pinia-list-store/src/actions/patchOne.js'

import useSystemMessagesStore from './systemMessages.js'

export default (connectors) => {
  const userStore = defineStore('users', {
    state: infiniteListState,
    actions: {
      load: load(connectors.user.list, useSystemMessagesStore().addError, { metaFirst: false }),
      deleteOne: deleteOne(connectors.user.deleteOne, useSystemMessagesStore().addError, { optimistic: false }),
      patchRole: patchOne(connectors.user.patchRole, useSystemMessagesStore().addError, { optimistic: false }),
      config: connectors.config.getConfig
    }
  })

  return userStore
}
