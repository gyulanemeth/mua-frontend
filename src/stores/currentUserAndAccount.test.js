import { createApp } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { test, beforeEach, expect, describe } from 'vitest'

import jwt from 'jsonwebtoken'

import useCurrentUserAndAccountStore from './currentUserAndAccount.js'
import RouteError from '../errors/RouteError.js'

const secrets = 'verylongsecret1'

describe('Current User And Account Store', () => {
  global.localStorage = {
    data: {},
    getItem (key) {
      return this.data[key]
    },
    setItem (key, value) {
      this.data[key] = value
    },
    removeItem (key) {
      delete this.data[key]
    }
  }
  global.window = {
    config: {
      accountsApiBaseUrl: 'http://accounts-api.emailfox.link',
      sideBarIcons: [{
        icon: 'testIcon',
        url: () => {
          return 'path'
        },
        name: 'test'
      }]
    },
    location: {
      pathname: ''
    }
  }

  const app = createApp({})

  const mokeConnector = () => {
    const mockLoginGetAccounts = (formData) => {
      if (!formData || !formData.email) {
        throw new RouteError('User Email Is Required')
      }
      return { success: true }
    }

    const mockLogin = (formData) => {
      if (!formData || !formData.password || !formData.accountId) {
        throw new RouteError('User Password Is Required')
      }
      const token = jwt.sign({ type: 'login', user: { _id: '12test12', email: 'user1@gmail.com' }, account: { _id: '112233' } }, secrets)
      return token
    }

    const mockLoginWithUrlFriendlyName = (formData) => {
      if (!formData || !formData.password || !formData.urlFriendlyName) {
        throw new RouteError('User Password Is Required')
      }
      const token = jwt.sign({ type: 'login', user: { _id: '12test12', email: 'user1@gmail.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' } }, secrets)
      return token
    }

    const mockSendForgetPasssword = (data) => {
      if (!data || !data.email || !data.id) {
        throw new RouteError('Email Is Required')
      }
      return { success: true }
    }

    const mockCreateOne = async function (formData) {
      if (!formData || !formData.account || !formData.account.name || !formData.account.urlFriendlyName) {
        throw new RouteError('Account Name And UrlFriendlyName Is Required')
      } else if (!formData.user || !formData.user.name || !formData.user.email || !formData.user.password) {
        throw new RouteError('User Name, Email And Password Is Required')
      }
      return { success: true }
    }

    const mockReset = async function (formData) {
      if (!formData || !formData.id || !formData.token || !formData.newPassword || !formData.newPasswordAgain) {
        throw new RouteError('User Password Is Required')
      }
      const token = jwt.sign({ type: 'login', user: { _id: '12test12', email: 'user@email.com' }, account: { _id: '112233' } }, secrets)
      return token
    }

    const mockSendInvitation = async function (data) {
      if (!data || !data.id || !data.email) {
        throw new RouteError('Email Is Required')
      }
      return { success: true }
    }

    const mockReSendInvitation = async function (data) {
      if (!data || !data.id || !data.email) {
        throw new RouteError('Email Is Required')
      }
      return { success: true }
    }

    const mockAccept = async function (formData) {
      if (!formData || !formData.id || !formData.token || !formData.newPassword || !formData.newPasswordAgain) {
        throw new RouteError('Accouunt Password Is Required')
      }
      const token = jwt.sign({ type: 'login', user: { _id: '12test12', email: 'user@email.com' }, account: { _id: '112233' } }, secrets)
      return token
    }

    const mockUserReadOne = (data) => {
      if (!data || !data.accountId || !data.id) {
        throw new RouteError('ID And Account ID Is Required')
      }
      return { name: 'user1', email: 'user1@gmail.com', _id: '12test12' }
    }
    const mockAccountReadOne = (id) => {
      if (!id) {
        throw new RouteError('Admin ID Is Required')
      }
      return { name: 'user1', urlFriendlyName: 'urlFriendlyName1', _id: '12test12' }
    }

    const mockPatchUserName = async function (data) {
      if (!data || !data.id || !data.accountId || !data.name) {
        throw new RouteError('User ID, Account ID And New Name Is Required')
      }
      return data.name
    }
    const mockPatchAccountName = async function (formData) {
      if (!formData || !formData.id || !formData.name) {
        throw new RouteError('Account ID And New Name Is Required')
      }
      return formData.name
    }
    const mockPatchAccountUrlFriendlyName = async function (formData) {
      if (!formData || !formData.id || !formData.urlFriendlyName) {
        throw new RouteError('Account ID And New urlFriendlyName Is Required')
      }
      return formData.urlFriendlyName
    }

    const mockPatchPassword = async function (formData) {
      if (!formData || !formData.id || !formData.accountId || !formData.oldPassword || !formData.newPassword || !formData.newPasswordAgain) {
        throw new RouteError('User ID, Account ID And New Password Is Required')
      }
      return { success: true }
    }

    const mockgetAccessToken = (data) => {
      if (!data || !data.accountId || !data.id) {
        throw new RouteError('ID And Account ID Is Required')
      }
      const token = jwt.sign(
        {
          type: 'user',
          user: {
            _id: '123',
            email: 'user@email.com'
          },
          account: {
            _id: '112233',
            urlFriendlyName: 'urlFriendlyName1'
          },
          role: 'admin'
        }, secrets)
      return token
    }

    const mockFinalizeRegistration = async (data) => {
      if (!data || !data.id || !data.accountId || !data.token) {
        throw new RouteError('User Id And Account Id Is Required')
      }
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6eyJfaWQiOiIxMnRlc3QxMiJ9LCJhY2NvdW50Ijp7Il9pZCI6IjEyM3Rlc3QxMjMifSwiaWF0IjoxNTE2MjM5MDIyfQ.dmLGrl7qt43fb34XQQqYA1AirTvWErg_9hnOAA8OmG8'
    }

    const mockPatchEmail = async function (formData) {
      if (!formData || !formData.id || !formData.accountId || !formData.newEmail) {
        throw new RouteError('User ID, Account ID And New Email Is Required')
      }
      return 'success'
    }

    const mockGetAccountByUrlFriendlyName = async function (params) {
      if (!params || !params.urlFriendlyName) {
        throw new RouteError('Account urlFriendlyName Is Required')
      }
      return 'success'
    }

    const mockPatchEmailConfirm = async function (formData) {
      if (!formData || !formData.id || !formData.accountId || !formData.token) {
        throw new RouteError('User ID, Account ID and token Is Required')
      }
      return 'success'
    }

    const mockUploadUserProfilePicture = async function (params, formData) {
      if (!params || !params.id || !params.accountId || !formData) {
        throw new RouteError('param and form Data Is Required')
      }
      return { profilePicture: 'test' }
    }

    const mockDeleteUserProfilePicture = async function (params) {
      if (!params || !params.id || !params.accountId) {
        throw new RouteError('Account and User Id Is Required')
      }
      return { success: true }
    }

    const mockUploadLogo = async function (params, formData) {
      if (!params || !params.id || !formData) {
        throw new RouteError('param and form Data Is Required')
      }
      return { success: true, profilePicture: 'test' }
    }

    const mockDeleteLogo = async function (params) {
      if (!params || !params.id) {
        throw new RouteError('Account Id Is Required')
      }
      return { success: true }
    }

    const mockReSendfinalizeRegistrationEmail = async function (data) {
      if (!data || !data.userId || !data.accountId) {
        throw new RouteError('User Id And Account Id Is Required')
      }
      return { success: true }
    }

    return {
      account: { deleteLogo: mockDeleteLogo, getAccountByUrlFriendlyName: mockGetAccountByUrlFriendlyName, uploadLogo: mockUploadLogo, patchName: mockPatchAccountName, patchUrlFriendlyName: mockPatchAccountUrlFriendlyName, createOne: mockCreateOne, readOne: mockAccountReadOne, finalizeRegistration: mockFinalizeRegistration },
      invitation: { send: mockSendInvitation, accept: mockAccept, reSend: mockReSendInvitation },
      forgotPassword: { send: mockSendForgetPasssword, reset: mockReset },
      user: { reSendfinalizeRegistrationEmail: mockReSendfinalizeRegistrationEmail, deleteProfilePicture: mockDeleteUserProfilePicture, uploadProfilePicture: mockUploadUserProfilePicture, patchName: mockPatchUserName, patchPassword: mockPatchPassword, getAccessToken: mockgetAccessToken, login: mockLogin, loginWithUrlFriendlyName: mockLoginWithUrlFriendlyName, loginGetAccounts: mockLoginGetAccounts, readOne: mockUserReadOne, patchEmail: mockPatchEmail, patchEmailConfirm: mockPatchEmailConfirm }
    }
  }

  beforeEach(() => {
    const pinia = createPinia().use(useCurrentUserAndAccountStore)
    app.use(pinia)
    setActivePinia(createPinia())
  })

  test('test success login', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    await store.login(token, '12123password', '112233')
    expect(store.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(store.accessToken).toEqual(token)
  })

  test('test success login get accounts', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.loginGetAccounts('12123password')
    expect(res).toEqual({ success: true })
  })

  test('test success get account by urlFriendlyName', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.getAccountByUrlFriendlyName('12123password')
    expect(res).toEqual('success')
  })

  test('test get account by urlFriendlyName invalid input', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.getAccountByUrlFriendlyName()
    expect(res.message).toEqual('Account urlFriendlyName Is Required')
  })

  test('test login get accounts error invalid ', async () => {
    localStorage.removeItem('accessToken')
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.loginGetAccounts()
    expect(res.message).toEqual('User Email Is Required')
    expect(store.user).toEqual(undefined)
    expect(store.accessToken).toEqual(undefined)
  })

  test('test login error invalid ', async () => {
    localStorage.removeItem('accessToken')
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.login()
    expect(res.message).toEqual('User Password Is Required')
    expect(store.user).toEqual(undefined)
    expect(store.accessToken).toEqual(undefined)
  })

  test('test check loggedin ', async () => {
    localStorage.removeItem('accessToken')
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.loggedIn
    expect(res).toEqual(false)
  })

  test('test logOut', async () => {
    const token = jwt.sign({ type: 'token', data: 'token' }, secrets)
    window.location.search = { token, accountId: '112233' }
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.accessToken = 'token'
    store.user = { name: 'test' }
    await store.logout()
    expect(store.user).toEqual(null)
    expect(store.accessToken).toEqual(null)
  })

  test('test logOut Admin', async () => {
    const token = jwt.sign({ type: 'admin', account: { urlFriendlyName: 'urlFriendlyName1' } }, secrets)
    window.location.search = { token, accountId: '112233' }
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.accessToken = token
    store.user = { name: 'test' }
    await store.logout()
    expect(store.user).toEqual(null)
    expect(store.accessToken).toEqual(null)
  })

  test('test success send forgot Password', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.sendForgotPassword({ email: 'user1@gmail.com', accountId: '12test12' })
    expect(res.success).toEqual(true)
  })

  test('test send forgot Password invalid input', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.sendForgotPassword('user1@gmail.com')
    expect(res.message).toEqual('account Id and email Is Required')
  })

  test('test success reset forgot Password', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com', accountId: '112233' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    await store.resetForgotPassword(token, 'newPassword', 'newPassword')
    expect(store.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
  })

  test('test reset forgot Password fail password is required', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com', accountId: '112233' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    const res = await store.resetForgotPassword(token, 'forgotPasswordToken')
    expect(res.message).toEqual('Valid token, password and new password Is Required')
  })

  test('test success send admin Invitation', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const res = await store.sendInvitation('user1@gmail.com')
    expect(res.success).toEqual(true)
  })

  test('test success reSendFinalizeRegistration ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.reSendFinalizeRegistration({accountId: '12test12', userId: '1234test1234'})
    expect(res.success).toEqual(true)
  })

  test('test error reSendFinalizeRegistration', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.reSendFinalizeRegistration({})
    expect(res.message).toEqual('User ID and Account ID Is Required')
  })

  test('test success resend admin Invitation', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const res = await store.reSendInvitation('user1@gmail.com')
    expect(res.success).toEqual(true)
  })

  test('test success createOne', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.createAccount({ user: { name: 'test', email: 'email@123.com', password: 'testPass' }, account: { name: 'testName', urlFriendlyName: 'testurlFriendlyName' } })
    expect(res.success).toEqual(true)
  })

  test('test error createOne', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.createAccount()
    expect(res.message).toEqual('Account Name And UrlFriendlyName Is Required')
  })

  test('test send admin Invitation undefined account id error', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = {}
    const res = await store.sendInvitation()
    expect(res.message).toEqual('account ID Is Required')
  })

  test('test resend admin Invitation undefined account id error', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = {}
    const res = await store.reSendInvitation()
    expect(res.message).toEqual('account ID Is Required')
  })

  test('test success accept invitation', async () => {
    window.location.pathname = '/'
    window.location.search = { token: 'token' }
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    await store.acceptInvitation(token, 'newPassword', 'newPassword')
    expect(store.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(store.accessToken).toEqual(token)
  })

  test('test accept invitation error', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    const res = await store.acceptInvitation(token, 'newPassword')
    expect(res.message).toEqual('Accouunt Password Is Required')
  })

  test('test success patchUserName', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    await store.patchUserName('user2')
    expect(store.user.name).toEqual('user2')
  })

  test('test patchUserName fail  id required ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = {}
    const res = await store.patchUserName('user2')
    expect(res.message).toEqual('User ID Is Required')
  })

  test('test success patchUrlFriendlyName', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123', urlFriendlyName: 'urlFriendlyName1' }
    await store.patchUrlFriendlyName('urlFriendlyName2')
    expect(store.account.urlFriendlyName).toEqual('urlFriendlyName2')
  })

  test('test patchUrlFriendlyName fail  id required ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = {}
    const res = await store.patchUrlFriendlyName('urlFriendlyName2')
    expect(res.message).toEqual('account ID Is Required')
  })

  test('test patchUrlFriendlyName fail  new name required ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchUrlFriendlyName()
    expect(res.message).toEqual('Account ID And New urlFriendlyName Is Required')
  })

  test('test success patchAccountName', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123', name: 'account1' }
    await store.patchAccountName('account2')
    expect(store.account.name).toEqual('account2')
  })

  test('test patchAccountName fail  id required ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = {}
    const res = await store.patchAccountName('user2')
    expect(res.message).toEqual('User ID Is Required')
  })

  test('test patchAccountName fail  new name required ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchAccountName()
    expect(res.message).toEqual('Account ID And New Name Is Required')
  })

  test('test success patchPassword', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchPassword('oldPassword', 'newPassword', 'newPassword')
    expect(res.success).toEqual(true)
  })

  test('test patchPassword fail account id required ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = {}
    store.user = {}
    const res = await store.patchPassword('oldPassword', 'newPassword', 'newPassword')
    expect(res.message).toEqual('Admin ID Is Required')
  })

  test('test patchPassword fail id required ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchPassword('oldPassword', 'newPassword')
    expect(res.message).toEqual('User ID, Account ID And New Password Is Required')
  })

  test('test patchPassword fail  password required ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchPassword('oldPassword', 'newPassword')
    expect(res.message).toEqual('User ID, Account ID And New Password Is Required')
  })

  test('test readOne success ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = { _id: '123123' }
    const res = await store.readOne()
    expect(res).toEqual({ name: 'user1', urlFriendlyName: 'urlFriendlyName1', _id: '12test12' })
  })

  test('test readOneUser success ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = { _id: '123123' }
    store.user = { _id: '123123' }
    const token = jwt.sign({ type: 'user', account: { urlFriendlyName: 'urlFriendlyName1' } }, secrets)
    localStorage.setItem('accessToken', token)

    const res = await store.readOneUser()
    expect(res).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
  })

  test('test readOneUser Admin success ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = { _id: '123123' }
    store.user = { _id: '123123' }
    const token = jwt.sign({ type: 'admin', user: { name: 'userName', _id: '123123' }, account: { urlFriendlyName: 'urlFriendlyName1' } }, secrets)
    localStorage.setItem('accessToken', token)
    const res = await store.readOneUser()
    expect(res).toEqual({ role: 'admin', name: 'userName', _id: '123123' })
  })

  test('test readOneUser /me success ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    window.location.pathname = '/me'
    store.account = {}
    store.user = {}
    const res = await store.readOneUser()
    expect(res.message).toEqual(undefined)
  })

  test('test readOneUser fail ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    store.account = {}
    store.user = {}
    localStorage.removeItem('accessToken')
    const res = await store.readOneUser()
    expect(res.message).toEqual('user ID Is Required')
  })

  test('test finalizeRegistration success ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)

    const res = await store.finalizeRegistration(token)
    expect(res.success).toEqual(true)
  })

  test('test finalizeRegistration expired ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets, { expiresIn: '1' })

    const res = await store.finalizeRegistration(token)
    expect(res.message).toEqual('Valid Token Is Required')
  })

  test('test finalizeRegistration fail ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()

    const res = await store.finalizeRegistration()
    expect(res.message).toEqual('Invalid token specified')
  })

  test('test readOne account id undefined ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    localStorage.removeItem('accountId')
    store.account = {}
    const res = await store.readOne()
    expect(res.message).toEqual('account ID Is Required')
  })

  test('test success patchEmail', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    userStore.user = { _id: '12test12' }
    userStore.account = { _id: '123test123' }

    const res = await userStore.patchEmail('testEmail@gmail.com')
    expect(res).toEqual('success')
  })

  test('test patchEmail fail admin id required ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    const res = await userStore.patchEmail('testEmail@gmail.com')
    expect(res.message).toEqual('User ID And Account ID Is Required')
  })

  test('test success patchEmailConfirm', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    const res = await userStore.patchEmailConfirm('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6eyJfaWQiOiIxMnRlc3QxMiJ9LCJhY2NvdW50Ijp7Il9pZCI6IjEyM3Rlc3QxMjMifSwiaWF0IjoxNTE2MjM5MDIyfQ.dmLGrl7qt43fb34XQQqYA1AirTvWErg_9hnOAA8OmG8')
    expect(res).toEqual('success')
  })

  test('test patchEmailConfirm fail Valid Token  required ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    const res = await userStore.patchEmailConfirm('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc')
    expect(res.message).toEqual('Valid Token Is Required')
  })

  test('test success uploadProfilePicture', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    userStore.user = { _id: '12test12' }
    userStore.account = { _id: '123test123' }
    const res = await userStore.uploadUserProfilePicture({ profilePicture: 'test' })
    expect(res.profilePicture).toEqual('test')
  })

  test('test success deleteProfilePicture', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    userStore.user = { _id: '12test12' }
    userStore.account = { _id: '123test123' }
    const res = await userStore.deleteUserProfilePicture()
    expect(res.success).toEqual(true)
  })

  test('test uploadProfilePicture params error', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    userStore.user = { _id: '12test12' }
    userStore.account = {}
    const res = await userStore.uploadUserProfilePicture()
    expect(res.message).toEqual('param and form Data Is Required')
  })

  test('test success deleteProfilePicture params error', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    userStore.user = {}
    userStore.account = {}
    const res = await userStore.deleteUserProfilePicture()
    expect(res.message).toEqual('Account and User Id Is Required')
  })

  test('test success uploadLogo', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    userStore.user = { _id: '12test12' }
    userStore.account = { _id: '123test123' }
    const res = await userStore.uploadLogo({ logo: 'test' })
    expect(res.success).toEqual(true)
  })

  test('test success deleteLogo', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    userStore.user = { _id: '12test12' }
    userStore.account = { _id: '123test123' }
    const res = await userStore.deleteLogo()
    expect(res.success).toEqual(true)
  })

  test('test uploadLogo params error', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    userStore.user = { _id: '12test12' }
    userStore.account = {}
    const res = await userStore.uploadLogo()
    expect(res.message).toEqual('param and form Data Is Required')
  })

  test('test success logo params error', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const userStore = currentUser()
    userStore.user = {}
    userStore.account = {}
    const res = await userStore.deleteLogo()
    expect(res.message).toEqual('Account Id Is Required')
  })

  test('test success login with UrlFriendlyName', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    await store.loginWithUrlFriendlyName({ password: 'password', urlFriendlyName: 'urlFriendlyName', email: 'test@test.com' })
    expect(store.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(store.accessToken).toEqual(token)
  })

  test('test success login with UrlFriendlyName input error ', async () => {
    const currentUser = useCurrentUserAndAccountStore(mokeConnector())
    const store = currentUser()
    const res = await store.loginWithUrlFriendlyName({})
    expect(res.message).toEqual('User Password Is Required')
  })
})
