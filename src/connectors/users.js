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

  const generateUserRoute = (params) => {
    return `/v1/accounts${params.accountId}/users${params.id ? '/'+ params.id : ''}`
  }

  const generateAccessTokenRoute = (params) => {
    return `/v1/accounts/${params.accountId}/users/${params.id}/access-token`
  }

  const generatePatchNameRoute = (params) => {
    return `/v1/accounts/${params.accountId}/users/${params.id}/name`
  }

  const generatePatchPasswordRoute = (params) => {
    return `/v1/accounts/${params.accountId}/users/${params.id}/password`
  }

  const generatePatchRoleRoute = (params) => {
    return `/v1/accounts/${params.accountId}/users/${params.id}/role`
  }

  const generateLoginRoute = (params) => {
    return `/v1/accounts/${params.id}/login`
  }


  const getUserList = createGetConnector(fetch, apiUrl, generateUserRoute, generateAdditionalHeaders)
  const del = createDeleteConnector(fetch, apiUrl, generateUserRoute, generateAdditionalHeaders)
  const createUser = createPostConnector(fetch, apiUrl, generateUserRoute, generateAdditionalHeaders)
  const getUser = createGetConnector(fetch, apiUrl, generateUserRoute, generateAdditionalHeaders)
  const getToken = createGetConnector(fetch, apiUrl, generateAccessTokenRoute, generateAdditionalHeaders)
  const updateName = createPatchConnector(fetch, apiUrl, generatePatchNameRoute, generateAdditionalHeaders)
  const updatePassword = createPatchConnector(fetch, apiUrl, generatePatchPasswordRoute, generateAdditionalHeaders)
  const updateRole = createPatchConnector(fetch, apiUrl, generatePatchRoleRoute, generateAdditionalHeaders)
  const postLogin = createPostConnector(fetch, apiUrl, generateLoginRoute)



  const list = async function (id,query) {
    if(id === undefined ){
      throw new RouteError("User ID Is Required")
    }
    const res = await getUserList(id)
    return res
  }



  const readOne = async function (data){
    if(data === undefined || data.accountId === undefined || data.id === undefined ){
      throw new RouteError("ID And Account ID Is Required")
    }
    const res = await getUser({id:data.id, accountId:data.accountId})
    return res
  }

  const getAccessToken = async function (data){
    if(data === undefined || data.accountId === undefined || data.id === undefined ){
      throw new RouteError("ID And Account ID Is Required")
    }
    const res = await getToken({id:data.id, accountId:data.accountId})
    if(res.accessToken){
      localStorage.setItem("accessToken", res.accessToken);
    }
    return res
  }


  const login = async function(formData){
    if(formData === undefined || formData.id === undefined || formData.email === undefined || formData.password === undefined ){
        throw new RouteError("User Email And Password Is Required")
      }
    const res = await postLogin({ id: formData.id },{ email:formData.email, password: formData.password})
    if(res.loginToken){
      localStorage.setItem("accessToken", res.loginToken);
    }
    return res.loginToken
  }


  const patchName = async function(formData){
    if(formData === undefined || formData.id === undefined|| formData.accountId === undefined || formData.name === undefined ){
        throw new RouteError("User ID, Account ID And New Name Is Required")
      }
    const res = await updateName({id:data.id, accountId:data.accountId}, {name: formData.name})
    return res
  }

  const patchPassword = async function(formData){
    if(formData === undefined || formData.id === undefined || formData.accountId === undefined || formData.oldPassword === undefined || formData.newPassword === undefined || formData.newPasswordAgain === undefined ){
        throw new RouteError("User ID, Account ID And New Password Is Required")
      }
    const res = await updatePassword({id:data.id, accountId:data.accountId}, {oldPassword: formData.oldPassword, newPassword: formData.newPassword, newPasswordAgain: formData.newPasswordAgain})
    return res
  }

  const patchRole = async function(formData){
    if(formData === undefined || formData.id === undefined|| formData.accountId === undefined || formData.role === undefined ){
        throw new RouteError("User ID, Account ID And New Role Is Required")
      }
    const res = await updateRole({id:data.id, accountId:data.accountId}, {role: formData.role})
    return res
  }

  const deleteOne = async function(data){
    if(data === undefined || data.id === undefined|| data.accountId === undefined){
        throw new RouteError("User ID and Account ID Is Required")
      }
    const res = await del({id:data.id, accountId:data.accountId})
    return res
  }


  return {
    user: { list, readOne, deleteOne, patchName, patchPassword, patchRole, getAccessToken, login }
  }
}
