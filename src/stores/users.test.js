import { createApp } from 'vue'
import { test, beforeEach, expect, describe } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import jwt from 'jsonwebtoken'

import useUsersStore from './users.js'
import RouteError from '../errors/RouteError.js'

const secrets = 'verylongsecret1'
describe('users Store', () => {
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
      apiBaseUrl: 'http://api.emailfox.link',
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
    const mockList = () => {
      return {
        items: [
          { name: 'user1', email: 'user1@gmail.com', _id: '12test12', role: 'user' },
          { name: 'user2', email: 'user2@gmail.com', _id: '13test13', role: 'user' },
          { name: 'user3', email: 'user3@gmail.com', _id: '14test14', role: 'user' },
          { name: 'user4', email: 'user4@gmail.com', _id: '15test15', role: 'user' }
        ],
        count: 4
      }
    }

    const mockPatchRole = (formData, body) => {
      if (formData === undefined || formData.id === undefined || formData.accountId === undefined || body.role === undefined) {
        throw new RouteError('User ID, Account ID And New Role Is Required')
      }
      return {
        _id: '14test14',
        name: 'user3',
        email: 'user3@gmail.com',
        role: body.role
      }
    }

    const mockDeleteOne = (id) => {
      if (id === undefined) {
        throw new RouteError('User ID Is Required')
      }
      return { name: 'user1', email: 'user1@gmail.com', _id: '12test12' }
    }

    const mockDeletePermission = (password) => {
      if (!password) {
        throw new RouteError('Password Is Required')
      }
      return { name: 'user1', email: 'user1@gmail.com', _id: '12test12' }
    }

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

    const mockReadOneAccount = (data) => {
      return { name: 'user1', urlFriendlyName: 'urlFriendlyNameTest', _id: '12test12', logo: 'http//test.png' }
    }

    const mockPatchUserName = async function (data) {
      if (!data || !data.id || !data.accountId || !data.name) {
        throw new RouteError('User ID, Account ID And New Name Is Required')
      }
      return data.name
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

    const mockReSendfinalizeRegistrationEmail = async function (data) {
      if (!data || !data.userId || !data.accountId) {
        throw new RouteError('User Id And Account Id Is Required')
      }
      return { success: true }
    }

    return {
      user: { reSendfinalizeRegistrationEmail: mockReSendfinalizeRegistrationEmail, deleteProfilePicture: mockDeleteUserProfilePicture, uploadProfilePicture: mockUploadUserProfilePicture, patchName: mockPatchUserName, patchPassword: mockPatchPassword, getAccessToken: mockgetAccessToken, login: mockLogin, loginWithUrlFriendlyName: mockLoginWithUrlFriendlyName, loginGetAccounts: mockLoginGetAccounts, readOne: mockUserReadOne, patchEmail: mockPatchEmail, patchEmailConfirm: mockPatchEmailConfirm, deletePermission: mockDeletePermission, list: mockList, deleteOne: mockDeleteOne, patchRole: mockPatchRole },
      account: { finalizeRegistration: mockFinalizeRegistration, readOne: mockReadOneAccount },
      invitation: { send: mockSendInvitation, accept: mockAccept, reSend: mockReSendInvitation },
      forgotPassword: { send: mockSendForgetPasssword, reset: mockReset }
    }
  }

  beforeEach(() => {
    const pinia = createPinia().use(useUsersStore)
    app.use(pinia)
    setActivePinia(createPinia())
  })

  test('test success List', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    await store.load()
    expect(store.count).toEqual(4)
  })

  test('test success DeleteOne', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    await store.load()
    await store.deleteOne({ id: store.items[0]._id, password: 123123, accountId: 112233 })
    expect(store.items[0].data.name).toEqual('user1')
  })

  test('test success PatchRole', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    await store.load()
    store.params = { accountId: '12test' }
    const res = await store.patchRole('14test14', { role: 'admin' })
    expect(res.role).toEqual('admin')
  })

  test('test success delete ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    await store.load()
    const res = await store.deleteOne({ id: store.items[0]._id, password: 123123, accountId: 112233 })
    expect(res).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
  })

  test('test error delete', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    await store.load()
    const res = await store.deleteOne({})
    expect(res.message).toEqual('Password Is Required')
  })

  test('test success login', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const token = jwt.sign({ type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    await store.login(token, '12123password', '112233')
    expect(store.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(store.accessToken).toEqual(token)
  })

  test('test success login check recent logins', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const token = jwt.sign({ type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    await store.login(token, '12123password', '112233')
    expect(JSON.parse(localStorage.getItem('recentLogins'))[0].urlFriendlyName).toEqual('urlFriendlyNameTest')
    expect(store.accessToken).toEqual(token)
  })

  test('test success login get accounts', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const res = await store.loginGetAccounts('12123password')
    expect(res).toEqual({ success: true })
  })

  test('test login get accounts error invalid ', async () => {
    localStorage.removeItem('accessToken')
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const res = await store.loginGetAccounts()
    expect(res.message).toEqual('User Email Is Required')
    expect(store.user).toEqual(undefined)
    expect(store.accessToken).toEqual(undefined)
  })

  test('test login error invalid ', async () => {
    localStorage.removeItem('accessToken')
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const res = await store.login()
    expect(res.message).toEqual('User Password Is Required')
    expect(store.user).toEqual(undefined)
    expect(store.accessToken).toEqual(undefined)
  })

  test('test logOut', async () => {
    const token = jwt.sign({ type: 'token', data: 'token' }, secrets)
    window.location.search = { token, accountId: '112233' }
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.accessToken = 'token'
    store.user = { name: 'test' }
    await store.logout()
    expect(store.user).toEqual(null)
    expect(store.accessToken).toEqual(null)
  })

  test('test logOut Admin', async () => {
    const token = jwt.sign({ type: 'admin', account: { urlFriendlyName: 'urlFriendlyName1' } }, secrets)
    window.location.search = { token, accountId: '112233' }
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.accessToken = token
    store.user = { name: 'test' }
    await store.logout()
    expect(store.user).toEqual(null)
    expect(store.accessToken).toEqual(null)
  })

  test('test success send forgot Password', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const res = await store.sendForgotPassword({ email: 'user1@gmail.com', accountId: '12test12' })
    expect(res.success).toEqual(true)
  })

  test('test send forgot Password invalid input', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const res = await store.sendForgotPassword('user1@gmail.com')
    expect(res.message).toEqual('account Id and email Is Required')
  })

  test('test success reset forgot Password', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const token = jwt.sign({ type: 'user', user: { _id: '123', email: 'user@email.com', accountId: '112233' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    await store.resetForgotPassword(token, 'newPassword', 'newPassword')
    expect(store.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
  })

  test('test reset forgot Password fail password is required', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const token = jwt.sign({ type: 'user', user: { _id: '123', email: 'user@email.com', accountId: '112233' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    const res = await store.resetForgotPassword(token, 'forgotPasswordToken')
    expect(res.message).toEqual('Valid token, password and new password Is Required')
  })

  test('test success send admin Invitation', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.account = { _id: '12test12' }
    const res = await store.sendInvitation('user1@gmail.com')
    expect(res.success).toEqual(true)
  })

  test('test success reSendFinalizeRegistration ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const res = await store.reSendFinalizeRegistration({ accountId: '12test12', userId: '1234test1234' })
    expect(res.success).toEqual(true)
  })

  test('test error reSendFinalizeRegistration', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const res = await store.reSendFinalizeRegistration({})
    expect(res.message).toEqual('User ID and Account ID Is Required')
  })

  test('test success resend admin Invitation', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.account = { _id: '12test12' }
    const res = await store.reSendInvitation('user1@gmail.com')
    expect(res.success).toEqual(true)
  })

  test('test send admin Invitation undefined account id error', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.account = {}
    localStorage.removeItem('accountId')
    const res = await store.sendInvitation()
    expect(res.message).toEqual('account ID Is Required')
  })

  test('test resend admin Invitation undefined account id error', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.account = {}
    localStorage.removeItem('accountId')
    const res = await store.reSendInvitation()
    expect(res.message).toEqual('account ID Is Required')
  })

  test('test success accept invitation', async () => {
    window.location.pathname = '/accounts/'
    window.location.search = { token: 'token' }
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.account = { _id: '12test12' }
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    await store.acceptInvitation(token, 'newPassword', 'newPassword')
    expect(store.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(store.accessToken).toEqual(token)
  })

  test('test accept invitation error', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.account = { _id: '12test12' }
    const token = jwt.sign({ type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    const res = await store.acceptInvitation(token, 'newPassword')
    expect(res.message).toEqual('Accouunt Password Is Required')
  })

  test('test get recent logins', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    localStorage.setItem('recentLogins', JSON.stringify([{ name: 'test', urlFriendlyName: 'urlFriendlyNameTest', logo: 'http://test.com' }]))
    const res = await store.getRecentLoginsAccounts()
    expect(res[0]).toEqual({ name: 'test', urlFriendlyName: 'urlFriendlyNameTest', logo: 'http://test.com' })
    localStorage.removeItem('recentLogins')
  })

  test('test get recent logins', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    localStorage.setItem('recentLogins', JSON.stringify([]))
    const res = await store.getRecentLoginsAccounts()
    expect(res).toEqual(false)
    localStorage.removeItem('recentLogins')
  })

  test('test get recent logins error', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    localStorage.setItem('recentLogins', [{ name: 'test', urlFriendlyName: 'urlFriendlyNameTest', logo: 'http://test.com' }])
    await expect(await store.getRecentLoginsAccounts()).toBe(false)
    localStorage.removeItem('recentLogins')
  })

  test('test success patchUserName', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.user = { _id: '12test12', name: 'user1' }
    await store.patchUserName('user2')
    expect(store.user.name).toEqual('user2')
  })

  test('test patchUserName fail  id required ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.user = { }
    const res = await store.patchUserName('user2')
    expect(res.message).toEqual('User ID Is Required')
  })

  test('test success patchPassword', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.user = { _id: '12test12', name: 'user1' }
    const res = await store.patchPassword('oldPassword', 'newPassword', 'newPassword')
    expect(res.success).toEqual(true)
  })

  test('test patchPassword fail account id required ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.account = {}
    store.user = {}
    const res = await store.patchPassword('oldPassword', 'newPassword', 'newPassword')
    expect(res.message).toEqual('Admin ID Is Required')
  })

  test('test patchPassword fail id required ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.user = { _id: '12test12', name: 'user1' }
    const res = await store.patchPassword('oldPassword', 'newPassword')
    expect(res.message).toEqual('User ID, Account ID And New Password Is Required')
  })

  test('test patchPassword fail  password required ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.user = { _id: '12test12', name: 'user1' }
    const res = await store.patchPassword('oldPassword', 'newPassword')
    expect(res.message).toEqual('User ID, Account ID And New Password Is Required')
  })

  test('test readOne success ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.user = { _id: '123123' }
    const token = jwt.sign({ type: 'user', account: { urlFriendlyName: 'urlFriendlyName1' } }, secrets)
    localStorage.setItem('accessToken', token)

    const res = await store.readOne()
    expect(res).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
  })

  test('test readOne Admin success ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.user = { _id: '123123' }
    const token = jwt.sign({ type: 'admin', user: { name: 'userName', _id: '123123' }, account: { urlFriendlyName: 'urlFriendlyName1' } }, secrets)
    localStorage.setItem('accessToken', token)
    const res = await store.readOne()
    expect(res).toEqual({ role: 'admin', name: 'userName', _id: '123123' })
  })

  test('test readOne /me success ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    window.location.pathname = '/accounts/me'
    store.account = {}
    store.user = {}
    const res = await store.readOne()
    expect(res.message).toEqual(undefined)
  })

  test('test readOne fail ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    store.account = {}
    store.user = {}
    localStorage.removeItem('accessToken')
    const res = await store.readOne()
    expect(res.message).toEqual('user ID Is Required')
  })

  test('test finalizeRegistration success ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const token = jwt.sign({ type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    const res = await store.finalizeRegistration(token)
    expect(res.success).toEqual(true)
  })

  test('test finalizeRegistration expired ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const token = jwt.sign({ type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets, { expiresIn: '1' })
    const res = await store.finalizeRegistration(token)
    expect(res.message).toEqual('Valid Token Is Required')
  })

  test('test finalizeRegistration fail ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const res = await store.finalizeRegistration()
    expect(res.message).toEqual('Invalid token specified')
  })

  test('test success patchEmail', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const userStore = usersStore()
    userStore.user = { _id: '12test12' }
    const res = await userStore.patchEmail('testEmail@gmail.com')
    expect(res).toEqual('success')
  })

  test('test patchEmail fail admin id required ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const userStore = usersStore()
    userStore.user = {}
    const res = await userStore.patchEmail('testEmail@gmail.com')
    expect(res.message).toEqual('User ID And Account ID Is Required')
  })

  test('test success patchEmailConfirm', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const userStore = usersStore()
    const res = await userStore.patchEmailConfirm('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6eyJfaWQiOiIxMnRlc3QxMiJ9LCJhY2NvdW50Ijp7Il9pZCI6IjEyM3Rlc3QxMjMifSwiaWF0IjoxNTE2MjM5MDIyfQ.dmLGrl7qt43fb34XQQqYA1AirTvWErg_9hnOAA8OmG8')
    expect(res).toEqual('success')
  })

  test('test patchEmailConfirm fail Valid Token  required ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const userStore = usersStore()
    const res = await userStore.patchEmailConfirm('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc')
    expect(res.message).toEqual('Valid Token Is Required')
  })

  test('test success uploadProfilePicture', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const userStore = usersStore()
    userStore.user = { _id: '12test12' }

    const res = await userStore.uploadProfilePicture({ profilePicture: 'test' })
    expect(res.profilePicture).toEqual('test')
  })

  test('test success deleteProfilePicture', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const userStore = usersStore()
    userStore.user = { _id: '12test12' }

    const res = await userStore.deleteProfilePicture()
    expect(res.success).toEqual(true)
  })

  test('test uploadProfilePicture params error', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const userStore = usersStore()
    userStore.user = { _id: '12test12' }
    userStore.account = {}
    const res = await userStore.uploadProfilePicture()
    expect(res.message).toEqual('param and form Data Is Required')
  })

  test('test success deleteProfilePicture params error', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const userStore = usersStore()
    userStore.user = {}
    userStore.account = {}
    const res = await userStore.deleteProfilePicture()
    expect(res.message).toEqual('Account and User Id Is Required')
  })

  test('test success login with UrlFriendlyName', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const res = await store.loginWithUrlFriendlyName({ password: 'password', urlFriendlyName: 'urlFriendlyName', email: 'test@test.com' })
    expect(store.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(res.success).toEqual(true)
  })

  test('test success login with UrlFriendlyName input error ', async () => {
    const usersStore = useUsersStore(mokeConnector())
    const store = usersStore()
    const res = await store.loginWithUrlFriendlyName({})
    expect(res.message).toEqual('User Password Is Required')
  })
})
