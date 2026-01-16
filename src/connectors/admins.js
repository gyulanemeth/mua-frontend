import {
  createGetConnector,
  createPostConnector,
  createPatchConnector,
  createDeleteConnector,
  createPostBinaryConnector
} from 'standard-json-api-connectors'

import RouteError from '../errors/RouteError.js'

export default function (fetch, apiUrl) {
  const generateAdditionalHeaders = () => {
    return { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  }

  const generateAdminRoute = (params) => `/v1/system-admins${params.id ? '/' + params.id : ''}`
  const generateTokenRoute = (params) => `/v1/system-admins/${params.id}/access-token`

  const generatePatchNameRoute = (params) => `/v1/system-admins/${params.id}/name`
  const generatePatchPasswordRoute = (params) => `/v1/system-admins/${params.id}/password`
  const generatePatchEmailRoute = (params) => `/v1/system-admins/${params.id}/email`
  const generatePatchConfirmEmailRoute = (params) => `/v1/system-admins/${params.id}/email-confirm`

  const generateLoginRoute = () => '/v1/system-admins/login/'
  const generateSendInvitationRoute = () => '/v1/system-admins/invitation/send'
  const generateReSendInvitationRoute = () => '/v1/system-admins/invitation/resend'
  const generateAcceptInvitationRoute = () => '/v1/system-admins/invitation/accept'
  const generateSendForgotPasswordRoute = () => '/v1/system-admins/forgot-password/send'
  const generateResetForgotPasswordRoute = () => '/v1/system-admins/forgot-password/reset'

  const generateDeletePermissionRoute = () => '/v1/system-admins/permission/delete'
  const generateUploadImageRoute = (params) => `/v1/system-admins/${params.id}/profile-picture/`

  const generatePatchDisconnectProviderRoute = (params) => `/v1/system-admins/${params.id}/provider/google`
  const generateDisconnectPermissionRoute = (params) => `/v1/${params.type}/permission/disconnect`

  const generateMFARoute = (params) => `/v1/system-admins/${params.id}/mfa`

  const getAdmin = createGetConnector(fetch, apiUrl, generateAdminRoute, generateAdditionalHeaders)
  const del = createDeleteConnector(fetch, apiUrl, generateAdminRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('delete-permission-token')}` }))
  const getToken = createGetConnector(fetch, apiUrl, generateTokenRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('loginToken')}` }))
  const updateName = createPatchConnector(fetch, apiUrl, generatePatchNameRoute, generateAdditionalHeaders)
  const updatePassword = createPatchConnector(fetch, apiUrl, generatePatchPasswordRoute, generateAdditionalHeaders)
  const postLogin = createPostConnector(fetch, apiUrl, generateLoginRoute)
  const postSendInvitation = createPostConnector(fetch, apiUrl, generateSendInvitationRoute, generateAdditionalHeaders)
  const postReSendInvitation = createPostConnector(fetch, apiUrl, generateReSendInvitationRoute, generateAdditionalHeaders)
  const postAcceptedInvitaion = createPostConnector(fetch, apiUrl, generateAcceptInvitationRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('invitationToken')}` }))
  const postSendForgotPassword = createPostConnector(fetch, apiUrl, generateSendForgotPasswordRoute)
  const postResetForgotPassword = createPostConnector(fetch, apiUrl, generateResetForgotPasswordRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('resetPasswordToken')}` }))
  const updateEmail = createPatchConnector(fetch, apiUrl, generatePatchEmailRoute, generateAdditionalHeaders)
  const confirmEmailUpdate = createPatchConnector(fetch, apiUrl, generatePatchConfirmEmailRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('verifyEmailToken')}` }))
  const delPermission = createPostConnector(fetch, apiUrl, generateDeletePermissionRoute, generateAdditionalHeaders)
  const deleteProfilePictureRoute = createDeleteConnector(fetch, apiUrl, (params) => `/v1/system-admins/${params.id}/profile-picture`, generateAdditionalHeaders)
  const uploadImageRoute = createPostBinaryConnector(fetch, apiUrl, 'profilePicture', generateUploadImageRoute, generateAdditionalHeaders)
  const postLoginWithProvider = createPostConnector(fetch, apiUrl, () => '/v1/system-admins/login/provider')
  const postLinkToProvider = createPostConnector(fetch, apiUrl, (params) => `/v1/system-admins/${params.id}/link`)
  const patchDisconnectProvider = createPatchConnector(fetch, apiUrl, generatePatchDisconnectProviderRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('admin-disconnect-permission-token')}` }))
  const disconnectPermissionUser = createPostConnector(fetch, apiUrl, generateDisconnectPermissionRoute, generateAdditionalHeaders)
  const getMFARoute = createGetConnector(fetch, apiUrl, generateMFARoute, generateAdditionalHeaders)
  const confirmMFARoute = createPostConnector(fetch, apiUrl, generateMFARoute, generateAdditionalHeaders)
  const disableMFARoute = createDeleteConnector(fetch, apiUrl, generateMFARoute, generateAdditionalHeaders)
  const postMFALogin = createPostConnector(fetch, apiUrl, () => '/v1/system-admins/mfa-login', () => ({ Authorization: `Bearer ${localStorage.getItem('two-factor-login')}` }))

  const list = async function (param, query) {
    const res = await getAdmin({}, query)
    return res
  }

  const readOne = async function (id) {
    if (!id) {
      throw new RouteError('Admin ID Is Required')
    }
    const res = await getAdmin(id)
    return res
  }

  const getAccessToken = async function (data) {
    if (!data || !data.id) {
      throw new RouteError('Admin ID Is Required')
    }
    const res = await getToken({ id: data.id })
    if (res.accessToken) {
      localStorage.setItem('accessToken', res.accessToken)
    }
    return res
  }

  const deleteOne = async function (id) {
    if (!id) {
      throw new RouteError('Admin ID Is Required')
    }
    const res = await del(id)
    localStorage.removeItem('delete-permission-token')
    return res
  }

  const deletePermission = async function (password) {
    if (!password) {
      throw new RouteError('Password Is Required')
    }
    const res = await delPermission({}, { password })
    localStorage.setItem('delete-permission-token', res.permissionToken)
  }

  const patchName = async function (formData) {
    if (!formData || !formData.id || !formData.name) {
      throw new RouteError('Admin ID And New Name Required')
    }
    const res = await updateName({ id: formData.id }, { name: formData.name })
    return res
  }
  const patchPassword = async function (formData) {
    if (!formData || !formData.id || !formData.oldPassword || !formData.newPassword || !formData.newPasswordAgain) {
      throw new RouteError('Admin ID, New Password, Old Password and confirm Password Required')
    }
    const res = await updatePassword({ id: formData.id }, { oldPassword: formData.oldPassword, newPassword: formData.newPassword, newPasswordAgain: formData.newPasswordAgain })
    return res
  }

  const loginWithProvider = async function () {
    const res = await postLoginWithProvider(null)
    return res
  }
  const linkToProvider = async function (params) {
    if (!params || !params.id) {
      throw new RouteError('admin id is Required')
    }
    const res = await postLinkToProvider(params)
    return res
  }

  const disconnectProvider = async function (data) {
    if (!data || !data.id) {
      throw new RouteError('Admin ID Is Required')
    }
    const res = await patchDisconnectProvider({ id: data.id, provider: data.provider })
    localStorage.removeItem('admin-disconnect-permission-token')
    return res
  }

  const disconnectPermission = async function (password) {
    if (!password) {
      throw new RouteError('Password Is Required')
    }
    const res = await disconnectPermissionUser({ type: 'system-admins' }, { password })
    localStorage.setItem('admin-disconnect-permission-token', res.permissionToken)
  }

  const login = async function (formData) {
    if (!formData || !formData.email || !formData.password) {
      throw new RouteError('Admin Email And Password Required')
    }
    const res = await postLogin({}, { email: formData.email, password: formData.password })
    if (res.loginToken) {
      localStorage.setItem('loginToken', res.loginToken)
    }
    if (res.twoFactorLoginToken) {
      localStorage.setItem('two-factor-login', res.twoFactorLoginToken)
    }
    return res
  }

  const getMFA = async function (params) {
    if (!params || !params.id) {
      throw new RouteError('ID Is Required')
    }
    const res = await getMFARoute({ id: params.id })
    return res
  }

  const disableMFA = async function (params) {
    if (!params || !params.id) {
      throw new RouteError('ID Is Required')
    }
    const res = await disableMFARoute({ id: params.id })
    return res
  }

  const confirmMFA = async function (params, body) {
    if (!params || !body || !params.id || !body.code) {
      throw new RouteError('ID and Code Is Required')
    }
    const res = await confirmMFARoute({ id: params.id }, { code: body.code })
    return res
  }

  const MFALogin = async function (formData) {
    if (!formData || (!formData.code && !formData.recoveryCode)) {
      throw new RouteError('Two Factor Code Is Required')
    }
    const res = await postMFALogin({}, formData)
    if (res.loginToken) {
      localStorage.setItem('loginToken', res.loginToken)
    }
    return res.loginToken
  }

  const sendInvitation = async function (data) {
    if (!data || !data.email) {
      throw new RouteError('Email is Required')
    }
    const res = await postSendInvitation({}, { email: data.email })
    return res
  }

  const reSendInvitation = async function (data) {
    if (!data || !data.email) {
      throw new RouteError('Email is Required')
    }
    const res = await postReSendInvitation({}, { email: data.email })
    return res
  }

  const accept = async function (formData) {
    if (!formData || !formData.token || !formData.newPassword || !formData.newPasswordAgain || !formData.name) {
      throw new RouteError('New Password, confirm Password, name and token Required')
    }
    localStorage.setItem('invitationToken', formData.token)
    const res = await postAcceptedInvitaion({}, { newPassword: formData.newPassword, newPasswordAgain: formData.newPasswordAgain, name: formData.name })
    if (res.loginToken) {
      localStorage.setItem('loginToken', res.loginToken)
      localStorage.removeItem('invitationToken')
    }
    return res.loginToken
  }

  const sendForgotPassword = async function (data) {
    if (!data || !data.email) {
      throw new RouteError('Email Is Required')
    }
    const res = await postSendForgotPassword({}, data)
    return res
  }

  const reset = async function (formData) {
    if (!formData || !formData.token || !formData.newPassword || !formData.newPasswordAgain) {
      throw new RouteError('Admin Password and confirmPassword Required')
    }
    localStorage.setItem('resetPasswordToken', formData.token)
    const res = await postResetForgotPassword({}, { newPassword: formData.newPassword, newPasswordAgain: formData.newPasswordAgain })
    if (res.loginToken) {
      localStorage.setItem('loginToken', res.loginToken)
      localStorage.removeItem('resetPasswordToken')
    }
    return res.loginToken
  }

  const patchEmail = async function (formData) {
    if (!formData || !formData.id || !formData.newEmail || !formData.newEmailAgain) {
      throw new RouteError('Admin ID, New Email and confirm Email Required')
    }
    const res = await updateEmail({ id: formData.id }, { newEmail: formData.newEmail, newEmailAgain: formData.newEmailAgain })
    return res
  }

  const patchEmailConfirm = async function (formData) {
    if (!formData || !formData.id || !formData.token) {
      throw new RouteError('Admin ID and token Required')
    }
    localStorage.setItem('verifyEmailToken', formData.token)
    const res = await confirmEmailUpdate({ id: formData.id })
    localStorage.removeItem('verifyEmailToken')
    return res
  }

  const uploadProfilePicture = async function (params, formData) {
    if (!params || !params.id || !formData) {
      throw new RouteError('param and form Data Is Required')
    }
    const res = await uploadImageRoute(params, formData)
    return res
  }

  const deleteProfilePicture = async function (params) {
    if (!params || !params.id) {
      throw new RouteError('User Id Is Required')
    }
    const res = await deleteProfilePictureRoute(params)
    return res
  }

  return {
    admins: { list, uploadProfilePicture, deleteProfilePicture, readOne, deleteOne, patchName, patchPassword, getAccessToken, login, patchEmail, patchEmailConfirm, deletePermission, loginWithProvider, linkToProvider, disconnectPermission, disconnectProvider, getMFA, confirmMFA, disableMFA, MFALogin },
    invitation: { send: sendInvitation, accept, reSend: reSendInvitation },
    forgotPassword: { send: sendForgotPassword, reset }
  }
}
