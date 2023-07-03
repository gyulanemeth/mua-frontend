import accounts from './accounts.js'
import users from './users.js'
import admins from './admins.js'

export default function () {
  const accountsConnectors = accounts(fetch, window.config.accountsApiBaseUrl)
  const userConnectors = users(fetch, window.config.accountsApiBaseUrl)
  const adminConnectors = admins(fetch, window.config.adminApiBaseUrl)

  return { userConnectors, accountsConnectors, adminConnectors }
}
