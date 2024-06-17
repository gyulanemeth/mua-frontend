import {
  createGetConnector,
  createPostConnector,
  createPatchConnector,
  createDeleteConnector,
  createPostBinaryConnector
} from 'standard-json-api-connectors'
import jwtDecode from 'jwt-decode'

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

  const generatePatchEmailRoute = (params) => `/v1/accounts/${params.accountId}/users/${params.id}/email`

  const generatePatchConfirmEmailRoute = (params) => `/v1/accounts/${params.accountId}/users/${params.id}/email-confirm`

  const generateLoginGetAccountsRoute = () => '/v1/accounts/login'

  const generateLoginRoute = (params) => `/v1/accounts/${params.id}/login`

  const generateDeletePermissionRoute = (params) => `/v1/${params.type}/permission/delete`

  const generateLoginWithUrlFriendlyNameRoute = (params) => `/v1/accounts/${params.id}/login/url-friendly-name`

  const generateReFinalizeRegistrationRoute = (params) => `/v1/accounts/${params.accountId}/users/${params.userId}/resend-finalize-registration`

  const generateUploadImage = (params) => `/v1/accounts/${params.accountId}/users/${params.id}/profile-picture`

  const getUserList = createGetConnector(fetch, apiUrl, generateUserRoute, generateAdditionalHeaders)
  const del = createDeleteConnector(fetch, apiUrl, generateUserRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('delete-permission-token')}` }))
  const getUser = createGetConnector(fetch, apiUrl, generateUserRoute, generateAdditionalHeaders)
  const getToken = createGetConnector(fetch, apiUrl, generateAccessTokenRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('loginToken')}` }))
  const updateName = createPatchConnector(fetch, apiUrl, generatePatchNameRoute, generateAdditionalHeaders)
  const updatePassword = createPatchConnector(fetch, apiUrl, generatePatchPasswordRoute, generateAdditionalHeaders)
  const updateRole = createPatchConnector(fetch, apiUrl, generatePatchRoleRoute, generateAdditionalHeaders)
  const postLogin = createPostConnector(fetch, apiUrl, generateLoginRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('loginToken')}` }))
  const postLoginGetEmails = createPostConnector(fetch, apiUrl, generateLoginGetAccountsRoute)
  const updateEmail = createPatchConnector(fetch, apiUrl, generatePatchEmailRoute, generateAdditionalHeaders)
  const confirmEmailUpdate = createPatchConnector(fetch, apiUrl, generatePatchConfirmEmailRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('verifyEmailToken')}` }))
  const delPermissionUser = createPostConnector(fetch, apiUrl, generateDeletePermissionRoute, generateAdditionalHeaders)
  const delPermissionAdmin = createPostConnector(fetch, apiUrl, generateDeletePermissionRoute, generateAdditionalHeaders)
  const deleteProfilePictureRoute = createDeleteConnector(fetch, apiUrl, (params) => `/v1/accounts/${params.accountId}/users/${params.id}/profile-picture`, generateAdditionalHeaders)
  const postLoginUrlFriendlyName = createPostConnector(fetch, apiUrl, generateLoginWithUrlFriendlyNameRoute)
  const postReFinalizeRegistration = createPostConnector(fetch, apiUrl, generateReFinalizeRegistrationRoute)
  const postUploadImage = createPostBinaryConnector(fetch, apiUrl, 'profilePicture', generateUploadImage, generateAdditionalHeaders)

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

  const reSendfinalizeRegistrationEmail = async function (data) {
    if (!data || !data.userId || !data.accountId) {
      throw new RouteError('User Id And Account Id Is Required')
    }
    const res = await postReFinalizeRegistration({ userId: data.userId, accountId: data.accountId })
    return res
  }

  const loginWithUrlFriendlyName = async function (formData) {
    if (!formData || !formData.password || !formData.urlFriendlyName) {
      throw new RouteError('User Password Is Required')
    }
    const res = await postLoginUrlFriendlyName({ id: formData.urlFriendlyName }, { password: formData.password, email: formData.email })
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
    localStorage.removeItem('delete-permission-token')
    return res
  }

  const deletePermission = async function (password) {
    if (!password) {
      throw new RouteError('Password Is Required')
    }
    let res
    if (jwtDecode(localStorage.getItem('accessToken')).type === 'admin') {
      res = await delPermissionAdmin({ type: 'system-admins' }, { password })
    } else {
      res = await delPermissionUser({ type: 'accounts' }, { password })
    }
    localStorage.setItem('delete-permission-token', res.permissionToken)
  }

  const patchEmail = async function (formData) {
    if (!formData || !formData.id || !formData.accountId || !formData.newEmail || !formData.newEmailAgain) {
      throw new RouteError('User ID, Account ID, New Email and New Email Confirm Is Required')
    }
    const res = await updateEmail({ id: formData.id, accountId: formData.accountId }, { newEmail: formData.newEmail, newEmailAgain: formData.newEmailAgain })
    return res
  }

  const patchEmailConfirm = async function (formData) {
    if (!formData || !formData.id || !formData.accountId || !formData.token) {
      throw new RouteError('User ID, Account ID and token Is Required')
    }
    localStorage.setItem('verifyEmailToken', formData.token)
    const res = await confirmEmailUpdate({ id: formData.id, accountId: formData.accountId })
    localStorage.removeItem('verifyEmailToken')
    localStorage.setItem('accessToken', res.accessToken)
    return res
  }

  const uploadProfilePicture = async function (params, formData) {
    if (!params || !params.id || !params.accountId || !formData) {
      throw new RouteError('param and form Data Is Required')
    }
    const res = await postUploadImage({ id: params.id, accountId: params.accountId }, formData)
    return res
  }

  const deleteProfilePicture = async function (params) {
    if (!params || !params.id || !params.accountId) {
      throw new RouteError('Account and User Id Is Required')
    }
    const res = await deleteProfilePictureRoute(params)
    return res
  }

  return {
    list, deleteProfilePicture, reSendfinalizeRegistrationEmail, loginWithUrlFriendlyName, uploadProfilePicture, readOne, deleteOne, patchName, patchPassword, patchRole, getAccessToken, login, loginGetAccounts, patchEmail, patchEmailConfirm, deletePermission
  }
}
