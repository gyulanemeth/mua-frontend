import {
  createGetConnector,
  createPostConnector,
  createPatchConnector,
  createDeleteConnector,
  createPostBinaryConnector
} from 'standard-json-api-connectors'

import RouteError from '../errors/RouteError.js'

export default function (fetch, apiUrl) {
  const generateAdditionalHeaders = (params) => {
    return { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  }

  const generateAccountRoute = (params) => `/v1/accounts${params.id ? '/' + params.id : ''}`

  const generatePatchurlFriendlyNameRoute = (params) => `/v1/accounts/${params.id}/urlFriendlyName`

  const generatePatchNameRoute = (params) => `/v1/accounts/${params.id}/name`

  const generateAccountByUrlFriendlyNameRoute = (params) => `/v1/accounts/by-url-friendly-name/${params.urlFriendlyName}`

  const generateCheckAvailabilityRoute = () => '/v1/accounts/check-availability'

  const generateCreateAccountRoute = () => '/v1/accounts/create'

  const generateCreateAccountByAdminRoute = () => '/v1/accounts'

  const generateFinalizeRegistrationRoute = (params) => `/v1/accounts/${params.accountId}/users/${params.id}/finalize-registration`

  const generateSendInvitationRoute = (params) => `/v1/accounts/${params.id}/invitation/send`

  const generateReSendInvitationRoute = (params) => `/v1/accounts/${params.id}/invitation/resend`

  const generateAcceptInvitationRoute = (params) => `/v1/accounts/${params.id}/invitation/accept`

  const generateSendForgotPasswordRoute = (params) => `/v1/accounts/${params.id}/forgot-password/send`

  const generateResetForgotPasswordRoute = (params) => `/v1/accounts/${params.id}/forgot-password/reset`

  const generateUploadImageRoute = (params) => `/v1/accounts/${params.id}/logo/`

  const getAccountsList = createGetConnector(fetch, apiUrl, generateAccountRoute, generateAdditionalHeaders)
  const getAccount = createGetConnector(fetch, apiUrl, generateAccountRoute, generateAdditionalHeaders)
  const updateName = createPatchConnector(fetch, apiUrl, generatePatchNameRoute, generateAdditionalHeaders)
  const updateUrlFriendlyName = createPatchConnector(fetch, apiUrl, generatePatchurlFriendlyNameRoute, generateAdditionalHeaders)
  const del = createDeleteConnector(fetch, apiUrl, generateAccountRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('delete-permission-token')}` }))
  const getCheckAvailability = createGetConnector(fetch, apiUrl, generateCheckAvailabilityRoute)
  const postCreateAccount = createPostConnector(fetch, apiUrl, generateCreateAccountRoute, generateAdditionalHeaders)
  const postCreateAccountByAdmin = createPostConnector(fetch, apiUrl, generateCreateAccountByAdminRoute, generateAdditionalHeaders)
  const postFinalizeRegistration = createPostConnector(fetch, apiUrl, generateFinalizeRegistrationRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('registrationToken')}` }))
  const postSendInvitation = createPostConnector(fetch, apiUrl, generateSendInvitationRoute, generateAdditionalHeaders)
  const postReSendInvitation = createPostConnector(fetch, apiUrl, generateReSendInvitationRoute, generateAdditionalHeaders)
  const postAcceptInvitation = createPostConnector(fetch, apiUrl, generateAcceptInvitationRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('invitationToken')}` }))
  const postSendForgotPassword = createPostConnector(fetch, apiUrl, generateSendForgotPasswordRoute)
  const postResetForgotPassword = createPostConnector(fetch, apiUrl, generateResetForgotPasswordRoute, () => ({ Authorization: `Bearer ${localStorage.getItem('resetPasswordToken')}` }))
  const deleteLogoRoute = createDeleteConnector(fetch, apiUrl, (params) => `/v1/accounts/${params.id}/logo`, generateAdditionalHeaders)
  const getByUrlFriendlyName = createGetConnector(fetch, apiUrl, generateAccountByUrlFriendlyNameRoute, generateAdditionalHeaders)
  const uploadImage = createPostBinaryConnector(fetch, apiUrl, 'logo', generateUploadImageRoute, generateAdditionalHeaders)

  const list = async function (param, query) {
    const res = await getAccountsList({}, query)
    return res
  }

  const getAccountByUrlFriendlyName = async function (param, query) {
    if (!param || !param.urlFriendlyName) {
      throw new RouteError('Account UrlFriendlyName Is Required')
    }
    const res = await getByUrlFriendlyName(param, query)
    return res
  }

  const readOne = async function (id) {
    if (!id) {
      throw new RouteError('Admin ID Is Required')
    }
    const res = await getAccount(id)
    return res
  }

  const patchName = async function (formData) {
    if (!formData || !formData.id || !formData.name) {
      throw new RouteError('Account ID And New Name Is Required')
    }
    const res = await updateName({ id: formData.id }, { name: formData.name })
    return res
  }

  const patchUrlFriendlyName = async function (formData) {
    if (!formData || !formData.id || !formData.urlFriendlyName) {
      throw new RouteError('Account ID And New urlFriendlyName Is Required')
    }
    const res = await updateUrlFriendlyName({ id: formData.id }, { urlFriendlyName: formData.urlFriendlyName })
    return res
  }

  const deleteOne = async function (id) {
    if (!id) {
      throw new RouteError('Account ID Is Required')
    }
    const res = await del(id)
    return res
  }

  const checkAvailability = async function (data) {
    if (!data || !data.urlFriendlyName) {
      throw new RouteError('Account UrlFriendlyName Is Required')
    }
    const res = await getCheckAvailability({}, { urlFriendlyName: data.urlFriendlyName })
    return res
  }

  const createOne = async function (formData) {
    if (!formData || !formData.account || !formData.account.name || !formData.account.urlFriendlyName) {
      throw new RouteError('Account Name And UrlFriendlyName Is Required')
    } else if (!formData.user || !formData.user.name || !formData.user.email || (!formData.user.password && !formData.user.googleProfileId && !formData.user.microsoftProfileId && !formData.user.githubProfileId)) {
      throw new RouteError('User Name, Email And Password Is Required')
    }
    const res = await postCreateAccount({}, { account: formData.account, user: formData.user, captchaText: formData.captchaText, captchaProbe: formData.captchaProbe })
    return res
  }

  const createOneByAdmin = async function (formData) {
    if (!formData || !formData.name || !formData.urlFriendlyName) {
      throw new RouteError('Name And UrlFriendlyName Is Required')
    }
    const res = await postCreateAccountByAdmin({}, { name: formData.name, urlFriendlyName: formData.urlFriendlyName })
    return res
  }

  const finalizeRegistration = async function (data) {
    if (!data || !data.id || !data.accountId || !data.token) {
      throw new RouteError('User Id And Account Id Is Required')
    }
    localStorage.setItem('registrationToken', data.token)
    const res = await postFinalizeRegistration({ id: data.id, accountId: data.accountId })
    localStorage.removeItem('registrationToken')
    if (res.loginToken) {
      localStorage.setItem('loginToken', res.loginToken)
    }
    return res.loginToken
  }

  const sendInvitation = async function (data) {
    if (!data || !data.id || !data.email) {
      throw new RouteError('Email Is Required')
    }
    const res = await postSendInvitation({ id: data.id }, { email: data.email })
    return res
  }

  const reSendInvitation = async function (data) {
    if (!data || !data.id || !data.email) {
      throw new RouteError('Email Is Required')
    }
    const res = await postReSendInvitation({ id: data.id }, { email: data.email })
    return res
  }

  const accept = async function (formData) {
    if (!formData || !formData.id || !formData.token || !formData.newPassword || !formData.newPasswordAgain || !formData.name) {
      throw new RouteError('Accouunt Password Is Required')
    }
    localStorage.setItem('invitationToken', formData.token)
    const res = await postAcceptInvitation({ id: formData.id }, { newPassword: formData.newPassword, newPasswordAgain: formData.newPasswordAgain, name: formData.name })
    if (res.loginToken) {
      localStorage.setItem('loginToken', res.loginToken)
      localStorage.removeItem('invitationToken')
    }
    return res.loginToken
  }

  const sendForgotPassword = async function (data) {
    if (!data || !data.email || !data.id) {
      throw new RouteError('Email Is Required')
    }
    const res = await postSendForgotPassword({ id: data.id }, { email: data.email, captchaText: data.captchaText, captchaProbe: data.captchaProbe })
    return res
  }

  const reset = async function (formData) {
    if (!formData || !formData.id || !formData.token || !formData.newPassword || !formData.newPasswordAgain) {
      throw new RouteError('User Password Is Required')
    }
    localStorage.setItem('resetPasswordToken', formData.token)
    const res = await postResetForgotPassword({ id: formData.id }, { newPassword: formData.newPassword, newPasswordAgain: formData.newPasswordAgain })
    if (res.loginToken) {
      localStorage.setItem('loginToken', res.loginToken)
      localStorage.removeItem('resetPasswordToken')
    }
    return res.loginToken
  }

  const uploadLogo = async function (params, formData) {
    if (!params || !params.id || !formData) {
      throw new RouteError('param and form Data Is Required')
    }
    const res = await uploadImage(params, formData)
    return res
  }

  const deleteLogo = async function (params) {
    if (!params || !params.id) {
      throw new RouteError('Account Id Is Required')
    }
    const res = await deleteLogoRoute(params)
    return res
  }

  return {
    account: { list, uploadLogo, deleteLogo, getAccountByUrlFriendlyName, readOne, deleteOne, patchName, patchUrlFriendlyName, createOne, createOneByAdmin, finalizeRegistration, checkAvailability },
    invitation: { send: sendInvitation, accept, reSend: reSendInvitation },
    forgotPassword: { send: sendForgotPassword, reset }
  }
}
