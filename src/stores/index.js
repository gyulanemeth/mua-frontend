import createCurrentUserAndAccountStore from './currentUserAndAccount.js'
import createUsersStore from './users.js'
import connectors from '../connectors/index.js'

const useCurrentUserAndAccountStore = () => {
  const store = createCurrentUserAndAccountStore({ ...connectors().accountsConnectors, ...connectors().userConnectors })
  return store()
}

const useUsersStore = () => {
  const store = createUsersStore(connectors().userConnectors)
  return store()
}

export { useCurrentUserAndAccountStore, useUsersStore }
