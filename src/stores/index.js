import createUsersStore from './users.js'
import createAdminsStore from './admins.js'
import createAccountsStore from './accounts.js'

import connectors from '../connectors/index.js'

const useUsersStore = () => {
  const store = createUsersStore({ ...connectors().accountsConnectors, user: connectors().userConnectors })
  return store()
}

const useAdminsStore = () => {
  const store = createAdminsStore(connectors().adminConnectors)
  return store()
}

const useAccountsStore = () => {
  const store = createAccountsStore({ ...connectors().accountsConnectors, user: connectors().userConnectors })
  return store()
}

export { useUsersStore, useAdminsStore, useAccountsStore }
