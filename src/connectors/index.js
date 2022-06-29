// http://localhost:10000/
import accounts from './accounts.js'
import users from './users.js'
export default function () {
  const apiUrl = 'http://localhost:20000'
  const accountsConnectors = accounts(fetch, apiUrl)
  const userConnectors = users(fetch, apiUrl)

  return { userConnectors, accountsConnectors }
}
