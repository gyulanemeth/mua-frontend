import accounts from './accounts.js'
import users from './users.js'

export default function () {
  const accountsConnectors = accounts(fetch, window.config.accountsApiBaseUrl)
  const userConnectors = users(fetch, window.config.accountsApiBaseUrl)

  return { userConnectors, accountsConnectors }
}
