import accounts from './accounts.js'
import users from './users.js'
import admins from './admins.js'
import stats from './stats.js'
import { env } from '../index.js'

export default function () {
  import.meta.env = import.meta.env ? import.meta.env : env()
  const accountsConnectors = accounts(fetch, import.meta.env.VITE_API_BASE_URL)
  const userConnectors = users(fetch, import.meta.env.VITE_API_BASE_URL)
  const adminConnectors = admins(fetch, import.meta.env.VITE_API_BASE_URL)
  const statsConnectors = stats(fetch, import.meta.env.VITE_API_BASE_URL)

  return { userConnectors, accountsConnectors, adminConnectors, statsConnectors }
}
