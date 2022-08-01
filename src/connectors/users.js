import {
  createGetConnector,
  createPostConnector,
  createPatchConnector,
  createDeleteConnector
} from 'standard-json-api-connectors'

import RouteError from '../errors/RouteError.js'

export default function (fetch, apiUrl) {
  const generateAdditionalHeaders = (params) => {
    return { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  }

  const generateUserRoute = (params, query) => `/v1/accounts/${params.accountId}/users${params.id ? '/' + params.id : ''}`

  const generateAccessTokenRoute = (params) => `/v1/accounts/${params.accountId}/users/${params.id}/access-token`

  const generatePatchNameRoute = (params) => `/v1/accounts/${params.accountId}/users/${params.id}/name`

  const generatePatchPasswordRoute = (params) => `/v1/accounts/${params.accountId}/users/${params.id}/password`

  const generatePatchRoleRoute = (params) => `/v1/accounts/${params.accountId}/users/${params.id}/role`

  const generateLoginGetAccountsRoute = () => '/v1/accounts/login'

  const generateLoginRoute = (params) => `/v1/accounts/${params.id}/login`

  const generateGetConfigRoute = () => '/v1/config'

  const getAccountConfig = createGetConnector(fetch, apiUrl, generateGetConfigRoute, generateAdditionalHeaders)
  const getUserList = createGetConnector(fetch, apiUrl, generateUserRoute, generateAdditionalHeaders)
  const del = createDeleteConnector(fetch, apiUrl, generateUserRoute, generateAdditionalHeaders)
  const getUser = createGetConnector(fetch, apiUrl, generateUserRoute, generateAdditionalHeaders)
  const getToken = createGetConnector(fetch, apiUrl, generateAccessTokenRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('loginToken')}` }))
  const updateName = createPatchConnector(fetch, apiUrl, generatePatchNameRoute, generateAdditionalHeaders)
  const updatePassword = createPatchConnector(fetch, apiUrl, generatePatchPasswordRoute, generateAdditionalHeaders)
  const updateRole = createPatchConnector(fetch, apiUrl, generatePatchRoleRoute, generateAdditionalHeaders)
  const postLogin = createPostConnector(fetch, apiUrl, generateLoginRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('loginToken')}` }))
  const postLoginGetEmails = createPostConnector(fetch, apiUrl, generateLoginGetAccountsRoute)
  //  const createUser = createPostConnector(fetch, apiUrl, generateUserRoute, generateAdditionalHeaders)

  const getConfig = async function () {
    const res = await getAccountConfig()
    return res
  }

  const list = async function (param, query) {
    if (!param) {
      throw new RouteError('Account ID Is Required')
    }
    const res = await getUserList(param, query)
    return res
  }

  const readOne = async function (data) {
    if (!data || !data.accountId || !data.id) {
      throw new RouteError('ID And Account ID Is Required')
    }
    const res = await getUser({ id: data.id, accountId: data.accountId })
    return res
  }

  const getAccessToken = async function (data) {
    if (!data || !data.accountId || !data.id) {
      throw new RouteError('ID And Account ID Is Required')
    }
    const res = await getToken({ id: data.id, accountId: data.accountId })
    if (res.accessToken) {
      localStorage.setItem('accessToken', res.accessToken)
      localStorage.removeItem('loginToken')
    }
    return res
  }

  const loginGetAccounts = async function (formData) {
    if (!formData || !formData.email) {
      throw new RouteError('User Email Is Required')
    }
    const res = await postLoginGetEmails({}, { email: formData.email })
    return res
  }

  const login = async function (formData) {
    if (!formData || !formData.password || !formData.accountId) {
      throw new RouteError('User Password Is Required')
    }
    const res = await postLogin({ id: formData.accountId }, { password: formData.password })
    if (res.loginToken) {
      localStorage.setItem('loginToken', res.loginToken)
    }
    return res.loginToken
  }

  const patchName = async function (data) {
    if (!data || !data.id || !data.accountId || !data.name) {
      throw new RouteError('User ID, Account ID And New Name Is Required')
    }
    const res = await updateName({ id: data.id, accountId: data.accountId }, { name: data.name })
    return res
  }

  const patchPassword = async function (formData) {
    if (!formData || !formData.id || !formData.accountId || !formData.oldPassword || !formData.newPassword || !formData.newPasswordAgain) {
      throw new RouteError('User ID, Account ID And New Password Is Required')
    }
    const res = await updatePassword({ id: formData.id, accountId: formData.accountId }, { oldPassword: formData.oldPassword, newPassword: formData.newPassword, newPasswordAgain: formData.newPasswordAgain })
    return res
  }

  const patchRole = async function (formData, body) {
    if (!formData || !formData.id || !formData.accountId || !body.role) {
      throw new RouteError('User ID, Account ID And New Role Is Required')
    }
    const res = await updateRole({ id: formData.id, accountId: formData.accountId }, { role: body.role })
    return res
  }

  const deleteOne = async function (data) {
    if (!data || !data.id || !data.accountId) {
      throw new RouteError('User ID and Account ID Is Required')
    }
    const res = await del({ id: data.id, accountId: data.accountId })
    return res
  }

  return {
    user: { list, readOne, deleteOne, patchName, patchPassword, patchRole, getAccessToken, login, loginGetAccounts },
    config: { getConfig }
  }
}
