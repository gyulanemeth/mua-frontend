import jwt_decode from "jwt-decode";
import { defineStore } from 'pinia'
import RouteError from '../errors/RouteError.js'
import systemMessages from './systemMessages.js'
export default (connectors) => {

  const currentUserAndAccountStore = defineStore('currentUserAndAccount', {
    state: () => ({
      accessToken:null,
      user: null,
      account: null
    }),
    actions: {
      async login (token, password, accountId) {
        try {
          localStorage.setItem("accessToken", token);
          this.accessToken = await connectors.user.login({password: password, accountId: accountId})
          const tokenData = jwt_decode(this.accessToken)
          this.accessToken = await connectors.user.getAccessToken({id: tokenData.user._id, accountId: tokenData.account._id})
          this.user = await connectors.user.readOne({id: tokenData.user._id, accountId: tokenData.account._id})
          this.account = await connectors.account.readOne({id: tokenData.account._id})
          return 'success'
        } catch (e) {
          systemMessages().addError(e)
        }
      },
      async loginGetAccounts (email) {
        try {
          const res = await connectors.user.loginGetAccounts({email: email})
          return res
        } catch (e) {
          systemMessages().addError(e)
        }
      },
      logout () {
     localStorage.removeItem("accessToken");
     this.accessToken = null
     this.user = null
    // forward to /
  },

    async  sendForgotPassword (email) {
        try {
          await connectors.forgotPassword.send({email:email, id:this.account._id})
          return 'success'
        } catch (e) {
          systemMessages().addError(e)
        }
      },

    async  resetForgotPassword (forgotPasswordToken, newPassword, newPasswordAgain) {
        try {
          this.accessToken = await connectors.forgotPassword.reset({id:this.account._id, token:forgotPasswordToken, newPassword: newPassword, newPasswordAgain: newPasswordAgain})
          const tokenData = jwt_decode(this.accessToken)
          this.accessToken = await connectors.admins.getAccessToken({id: tokenData.user._id})
          this.user = await connectors.admins.readOne({id: tokenData.user._id})
          return "success"
        } catch (e) {
          systemMessages().addError(e)
        }
      },

    async sendInvitation (email) {
        try {
          await connectors.invitation.send({email:email, id:this.account._id})
          return "success"
        } catch (e) {
          systemMessages().addError(e)
        }
      },
      async acceptInvitation (acceptInvitationToken, newPassword, newPasswordAgain) {
        try {
          this.accessToken = await connectors.invitation.accept({id:this.account._id, token:acceptInvitationToken, newPassword: newPassword, newPasswordAgain: newPasswordAgain })
          const tokenData = jwt_decode(this.accessToken)
          this.accessToken = await connectors.admins.getAccessToken({id: tokenData.user._id})
          this.user = await connectors.admins.readOne({id: tokenData.user._id})
          return "success"
        } catch (e) {
          systemMessages().addError(e)
        }
      },
      async readOne () {
        try {
          this.account = await connectors.account.readOne({id: this.account._id})
          return this.account
        } catch (e) {
          systemMessages().addError(e)
        }
      },
      async patchUserName (name) {
        try {
          if(this.account === null || this.account._id === undefined ){
            throw new RouteError("User ID Is Required")
          }
           await connectors.user.patchName({id: this.user._id, name:name, accountId:this.account._id})
          this.user.name = name
          return "success"
        } catch (e) {
          systemMessages().addError(e)
        }
      },
      async patchAccountName (name) {
        try {
          if(this.account === null || this.account._id === undefined ){
            throw new RouteError("User ID Is Required")
          }
           await connectors.account.patchName({id: this.account._id, name:name})
          this.account.name = name
          return "success"
        } catch (e) {
          systemMessages().addError(e)
        }
      },
      async patchUrlFriendlyName (newUrlFriendlyName) {
        try {
          if(this.account === null || this.account._id === undefined ){
            throw new RouteError("User ID Is Required")
          }
           await connectors.account.patchUrlFriendlyName({id: this.account._id, urlFriendlyName:newUrlFriendlyName})
           return "success"
        } catch (e) {
          systemMessages().addError(e)
        }
      },
      async patchPassword (oldPassword, newPassword, newPasswordAgain) {
      try {
        if(this.user === null || this.user._id === undefined || this.account === undefined || this.account._id === undefined ){
          throw new RouteError("Admin ID Is Required")
        }
         await connectors.user.patchPassword({accountId: this.account._id, id: this.user._id, oldPassword:oldPassword, newPassword: newPassword, newPasswordAgain: newPasswordAgain})
         return "success"
      } catch (e) {
        systemMessages().addError(e)
      }
    }

    }
  })

  return currentUserAndAccountStore
}
