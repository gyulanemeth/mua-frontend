import currentUserAndAdmin from './currentUserAndAdmin .js'
import users from './users.js'
import connectors from '../connectors/index.js'
export default function (){

const currentUserAndAdmin =  currentUserAndAdmin(connectors().accountsConnectors)
const users =  users(connectors().userConnectors)

  return {currentUserAndAdmin, users}
}
