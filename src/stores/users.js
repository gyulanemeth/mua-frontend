import { defineStore } from 'pinia'

import infiniteListState from 'pinia-list-store/src/state/infinite.js'
import deleteOne from 'pinia-list-store/src/actions/deleteOne.js'
import load from 'pinia-list-store/src/actions/load.js'
import patchOne from 'pinia-list-store/src/actions/patchOne.js'

import systemMessages from './systemMessages.js'

export default (connectors) => {
  const userStore = defineStore('users', {
    state: infiniteListState,
    actions: {
      load: load(connectors.user.list, systemMessages().addError, { metaFirst: false }),
      deleteOne: deleteOne(connectors.user.deleteOne, systemMessages().addError, { optimistic: false }),
      patchRole: patchOne(connectors.user.patchRole, systemMessages().addError, { optimistic: false }),
      config: connectors.config.getConfig
    }
  })

  return userStore
}
