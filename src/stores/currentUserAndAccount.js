import jwt_decode from "jwt-decode";
import { defineStore } from 'pinia'
import RouteError from '../errors/RouteError.js'

export default (connectors) => {

  const currentUserAndAccountStore = defineStore('currentUserAndAccount', {
    state: () => ({
      accessToken:null,
      user: null,
      account: null
    }),
    actions: {
      async login (email, password) {
        try {
          this.accessToken = await connectors.user.login({email: email, password: password})
          const tokenData = jwt_decode(this.accessToken)
          this.accessToken = await connectors.user.getAccessToken({id: tokenData.user._id, accountId: tokenData.account._id})
          this.user = await connectors.user.readOne({id: tokenData.user._id, accountId: tokenData.account._id})
          return this.user
        } catch (e) {
          return e
        }
      },
//3
      async readOne () {
        try {
          this.account = await connectors.account.readOne({id: this.account._id})
          return this.account
        } catch (e) {
          return e
        }
      },
//2
      async patchName (name) {
        try {
          if(this.account === null || this.account._id === undefined ){
            throw new RouteError("User ID Is Required")
          }
           await connectors.account.patchName({id: this.account._id, name:name})
          this.account.name = name
          return "success"
        } catch (e) {
          return e
        }
      },
//1
      async patchUrlFriendlyName (newUrlFriendlyName) {
        try {
          if(this.account === null || this.account._id === undefined ){
            throw new RouteError("User ID Is Required")
          }
           await connectors.account.patchUrlFriendlyName({id: this.account._id},{urlFriendlyName:newUrlFriendlyName})
           return "success"
        } catch (e) {
          return e
        }
      }
    }
  })

  return currentUserAndAccountStore
}
