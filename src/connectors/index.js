import accounts from './accounts.js'
import users from './users.js'
import admins from './admins.js'

export default function () {
  const accountsConnectors = accounts(fetch, import.meta.env.VITE_API_BASE_URL)
  const userConnectors = users(fetch, import.meta.env.VITE_API_BASE_URL)
  const adminConnectors = admins(fetch, import.meta.env.VITE_API_BASE_URL)

  return { userConnectors, accountsConnectors, adminConnectors }
}
