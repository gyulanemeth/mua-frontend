import useCurrentUserAndAccountStore from './currentUserAndAccount.js'
import useUsersStore from './users.js'
import connectors from '../connectors/index.js'

export default function () {
  const currentUserAndAccountStore = useCurrentUserAndAccountStore({ ...connectors().accountsConnectors, ...connectors().userConnectors })
  const usersStore = useUsersStore(connectors().userConnectors)

  return { currentUserAndAccountStore, usersStore }
}
