import accounts from './accounts.js'
import users from './users.js'
import admins from './admins.js'

export default function () {
  const accountsConnectors = accounts(fetch, window.config.apiBaseUrl)
  const userConnectors = users(fetch, window.config.apiBaseUrl)
  const adminConnectors = admins(fetch, window.config.apiBaseUrl)

  return { userConnectors, accountsConnectors, adminConnectors }
}
