import {
  createGetConnector,
  createPostConnector,
  createPatchConnector,
  createDeleteConnector
} from 'standard-json-api-connectors'
import RouteError from '../errors/RouteError.js'

export default function (fetch, apiUrl) {
  const generateAdditionalHeaders = (params) => {
    return { Authorization: 'Bearer ' + localStorage.getItem('accessToken') }
  }

  const generateAccountRoute = (params, query) => {
    return `/v1/accounts${params.id ? '/' + params.id : '' }${query ? '?' + query : ''}`
  }

  const generatePatchNameRoute = (params) => {
    return `/v1/accounts/${params.id}/name`
  }

  const generatePatchurlFriendlyNameRoute = (params) => {
    return `/v1/accounts/${params.id}/urlFriendlyName`
  }

  const generateCheckAvailabilityRoute = (query) => {
    return `/v1/accounts/check-availability?urlFrientlyName=${query}`
  }

const generateCreateAccountRoute = ()=>{
  return '/v1/accounts/create'
}

const generateFinalizeRegistrationRoute = (params) => {
  return `/v1/accounts/${params.accountId}/users/${params.id}/finalize-registration`
}

const generateSendInvitationRoute = (params) => {
  return `/v1/accounts/${params.id}/invitation/send`
}

const generateAcceptInvitationRoute = (params) => {
  return `/v1/accounts/${params.id}/invitation/accept`
}

const generateSendForgotPasswordRoute = (params) => {
  return `/v1/accounts/${params.id}/forgot-password/send`
}

const generateResetForgotPasswordRoute = (params) => {
  return `/v1/accounts/${params.id}/forgot-password/reset`
}



  const getAccountsList = createGetConnector(fetch, apiUrl, generateAccountRoute, generateAdditionalHeaders)
  const getAccount = createGetConnector(fetch, apiUrl, generateAccountRoute, generateAdditionalHeaders)
  const adminCreateAccount = createPostConnector(fetch, apiUrl, generateAccountRoute, generateAdditionalHeaders)
  const updateName = createPatchConnector(fetch, apiUrl, generatePatchNameRoute, generateAdditionalHeaders)
  const updateUrlFriendlyName = createPatchConnector(fetch, apiUrl, generatePatchurlFriendlyNameRoute, generateAdditionalHeaders)
  const del = createDeleteConnector(fetch, apiUrl, generateAccountRoute, generateAdditionalHeaders)
  const getCheckAvailability = createGetConnector(fetch, apiUrl, generateCheckAvailabilityRoute)
  const postCreateAccount = createPostConnector(fetch, apiUrl, generateCreateAccountRoute)
  const postFinalizeRegistration = createPostConnector(fetch, apiUrl, generateFinalizeRegistrationRoute, generateAdditionalHeaders)
  const postSendInvitation = createPostConnector(fetch, apiUrl, generateSendInvitationRoute, generateAdditionalHeaders)
  const postAcceptInvitation = createPostConnector(fetch, apiUrl, generateAcceptInvitationRoute, generateAdditionalHeaders)
  const postSendForgotPassword = createPostConnector(fetch, apiUrl, generateSendForgotPasswordRoute)
  const postResetForgotPassword = createPostConnector(fetch, apiUrl, generateResetForgotPasswordRoute, generateAdditionalHeaders)

  const list = async function (param,query) {
    const res = await getAccountsList({},query)
    return res
  }


  const readOne = async function (id){
    if(id === undefined ){
      throw new RouteError("Admin ID Is Required")
    }
    const res = await getAccount(id)
    return res
  }


  const adminCreateOne = async function (formData){
    if(formData === undefined  || formData.name === undefined || formData.urlFriendlyName === undefined ){
      throw new RouteError("FormData Name And UrlFriendlyName Is Required")
    }
    const res = await adminCreateAccount({}, {name:formData.name, urlFriendlyName: formData.urlFriendlyName })
    return res
  }


  const patchName = async function(formData){
    if(formData === undefined || formData.id === undefined || formData.name === undefined ){
        throw new RouteError("Account ID And New Name Is Required")
      }
    const res = await updateName({ id: formData.id }, {name: formData.name})
    return res
  }

  const patchUrlFriendlyName = async function(formData){
    if(formData === undefined || formData.id === undefined || formData.urlFriendlyName === undefined  ){
        throw new RouteError("Account ID And New Password Is Required")
      }
    const res = await updateUrlFriendlyName({ id: formData.id }, {urlFriendlyName: formData.urlFriendlyName})
    return res
  }

  const deleteOne = async function(id){
  if(id === undefined){
    throw new RouteError("Account ID Is Required")
  }
  const res = await del(id)
  return res
}

const checkAvailability = async function (data){
  if(data === undefined || data.urlFrientlyName == undefined){
    throw new RouteError("Account UrlFrientlyName Is Required")
  }
  const res = await getCheckAvailability(data.urlFrientlyName)

  return res
}


const createOne = async function (formData){
  if(formData === undefined || formData.account.name === undefined || formData.account.urlFriendlyName === undefined ){
    throw new RouteError("Account Name And UrlFriendlyName Is Required")
  }else if (formData.user.name === undefined || formData.user.email === undefined || formData.user.password === undefined) {
    throw new RouteError("User Name, Email And Password Is Required")
  }
  const res = await postCreateAccount({}, {name:formData.name, urlFriendlyName: formData.urlFriendlyName })
  return res
}


const finalizeRegistration = async function(data){
  if(data === undefined || data.id === undefined || data.accountId === undefined ){
    throw new RouteError("User Id And Account Id Is Required")
  }
  const res = await postFinalizeRegistration({ id:data.id, accountId: data.accountId})
  return res
}


const sendInvitation = async function(data){
  if(data === undefined || data.id === undefined || data.email === undefined){
    throw new RouteError("Email Is Required")
  }
  const res = await postSendInvitation({ id:data.id}, {email:data.email})
  return res
}

const accept = async function(formData){
  if(formData === undefined || data.id === undefined ||formData.token === undefined ||formData.newPassword === undefined || formData.newPasswordAgain === undefined ){
    throw new RouteError("Admin Password Is Required")
  }
  localStorage.setItem("accessToken", formData.token);
  const res = await postAcceptedInvitaion({ id:data.id},{newPassword: formData.newPassword, newPasswordAgain: formData.newPasswordAgain })
  return res
}

const sendForgotPassword = async function(data){
  if(data === undefined || data.email === undefined || data.id === undefined){
    throw new RouteError("Email Is Required")
  }
  const res = await postSendForgotPassword({ id:data.id}, {email:data.email})
  return res
}

const reset = async function(formData){
  if(formData === undefined || data.id === undefined ||formData.token === undefined || formData.newPassword === undefined || formData.newPasswordAgain === undefined ){
    throw new RouteError("Admin Password Is Required")
  }
  localStorage.setItem("accessToken", formData.token);
  const res = await postResetForgotPassword({ id:data.id},{ newPassword: formData.newPassword, newPasswordAgain: formData.newPasswordAgain })
  return res
}



  return {
    account: { list, readOne, deleteOne, patchName, patchUrlFriendlyName, adminCreateOne, createOne, finalizeRegistration, checkAvailability },
    invitation: { send: sendInvitation, accept },
    forgotPassword: { send: sendForgotPassword, reset }
  }
}
