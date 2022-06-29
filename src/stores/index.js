import currentUserAndAccount from './currentUserAndAccount.js'
import users from './users.js'
import connectors from '../connectors/index.js'
export default function () {
  const currentUserAndAccountStore = currentUserAndAccount({ ...connectors().accountsConnectors, ...connectors().userConnectors })
  const usersStore = users(connectors().userConnectors)

  return { currentUserAndAccountStore, usersStore }
}
