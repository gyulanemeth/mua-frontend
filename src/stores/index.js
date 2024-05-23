import createCurrentUserAndAccountStore from './currentUserAndAccount.js'
import createUsersStore from './users.js'
import createAdminsStore from './admins.js'
import connectors from '../connectors/index.js'

const useCurrentUserAndAccountStore = () => {
  const store = createCurrentUserAndAccountStore({ ...connectors().accountsConnectors, user: connectors().userConnectors })
  return store()
}

const useUsersStore = () => {
  const store = createUsersStore(connectors().userConnectors)
  return store()
}

const useAdminsStore = () => {
  const store = createAdminsStore(connectors().adminConnectors)
  return store()
}

export { useCurrentUserAndAccountStore, useUsersStore, useAdminsStore }
