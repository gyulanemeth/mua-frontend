import { createApp } from 'vue'
import { test, beforeEach, expect, describe } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import useAdminsStore from './admins.js'
import RouteError from '../errors/RouteError.js'
import jwt from 'jsonwebtoken'

const secrets = 'verylongsecret1'

describe('admins Store', () => {
  global.window = {
    location: {
      pathname: '/system-admins/login'
    },
    config: {
      apiBaseUrl: 'http://api.emailfox.link'
    }
  }
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

  const app = createApp({})

  const mokeConnector = () => {
    const mockList = () => {
      return {
        items: [
          { name: 'user1', email: 'user1@gmail.com', _id: '12test12' },
          { name: 'user2', email: 'user2@gmail.com', _id: '13test13' },
          { name: 'user3', email: 'user3@gmail.com', _id: '14test14' },
          { name: 'user4', email: 'user4@gmail.com', _id: '15test15' }
        ],
        count: 4
      }
    }

    const mockDeleteOne = (id) => {
      if (id === undefined) {
        throw new RouteError('Admin ID Is Required')
      }
      return { name: 'user1', email: 'user1@gmail.com', _id: '12test12' }
    }

    const mockDeletePermission = (password) => {
      if (!password) {
        throw new RouteError('Password Is Required')
      }
      return { name: 'user1', email: 'user1@gmail.com', _id: '12test12' }
    }

    const mockReadOne = (data) => {
      if (!data || !data.id) {
        throw new RouteError('Admin ID Is Required')
      }
      return { name: 'user1', email: 'user1@gmail.com', _id: '12test12' }
    }

    const mockLogin = (formData) => {
      if (formData === undefined || formData.email === undefined || formData.password === undefined) {
        throw new RouteError('Admin Email And Password Is Required')
      }
      const token = jwt.sign({ type: 'login', user: { _id: '12test12' } }, secrets)
      return token
    }
    const mockgetAccessToken = (data) => {
      if (data === undefined || data.id === undefined) {
        throw new RouteError('Admin ID Is Required')
      }
      const token = jwt.sign({ type: 'admin', user: { _id: '12test12', email: 'user1@gmail.com' } }, secrets)
      return token
    }

    const mockSendForgetPasssword = (data) => {
      if (data === undefined || data.email === undefined) {
        throw new RouteError('Email Is Required')
      }
      return { success: true }
    }
    const mockReset = async function (formData) {
      if (formData === undefined || formData.newPassword === undefined || formData.newPasswordAgain === undefined) {
        throw new RouteError('Admin Password Is Required')
      }
      const token = jwt.sign({ type: 'login', user: { _id: '12test12' } }, secrets)
      return token
    }

    const mockSendInvitation = async function (data) {
      if (data === undefined || data.email === undefined) {
        throw new RouteError('Email Is Required')
      }
      return { success: true }
    }

    const mockReSendInvitation = async function (data) {
      if (data === undefined || data.email === undefined) {
        throw new RouteError('Email Is Required')
      }
      return { success: true }
    }

    const mockAccept = async function (formData) {
      if (formData === undefined || formData.newPassword === undefined || formData.newPasswordAgain === undefined) {
        throw new RouteError('Admin Password Is Required')
      }
      const token = jwt.sign({ type: 'login', user: { _id: '12test12' } }, secrets)
      return token
    }

    const mockPatchName = async function (formData) {
      if (formData === undefined || formData.id === undefined || formData.name === undefined) {
        throw new RouteError('Admin ID And New Name Is Required')
      }
      return formData.name
    }
    const mockPatchPassword = async function (formData) {
      if (formData === undefined || formData.id === undefined || formData.oldPassword === undefined || formData.newPassword === undefined || formData.newPasswordAgain === undefined) {
        throw new RouteError('Admin ID And New Password Is Required')
      }
      return 'success'
    }
    const mockPatchEmail = async function (formData) {
      if (!formData || !formData.id || !formData.newEmail) {
        throw new RouteError('Admin ID And New Email Is Required')
      }
      return 'success'
    }
    const mockPatchEmailConfirm = async function (formData) {
      if (!formData || !formData.id || !formData.token) {
        throw new RouteError('Admin ID and token Is Required')
      }
      return 'success'
    }
    const mockUploadProfilePicture = async function (params, formData) {
      if (!params || !params.id || !formData) {
        throw new RouteError('param and form Data Is Required')
      }
      return { profilePicture: 'test' }
    }

    const mockDeleteProfilePicture = async function (params) {
      if (!params || !params.id) {
        throw new RouteError('User Id Is Required')
      }
      return { success: true }
    }

    return {
      admins: { readOne: mockReadOne, list: mockList, deleteOne: mockDeleteOne, deletePermission: mockDeletePermission, deleteProfilePicture: mockDeleteProfilePicture, uploadProfilePicture: mockUploadProfilePicture, login: mockLogin, getAccessToken: mockgetAccessToken, patchName: mockPatchName, patchPassword: mockPatchPassword, patchEmail: mockPatchEmail, patchEmailConfirm: mockPatchEmailConfirm },
      forgotPassword: { send: mockSendForgetPasssword, reset: mockReset },
      invitation: { send: mockSendInvitation, accept: mockAccept, reSend: mockReSendInvitation }
    }
  }

  beforeEach(() => {
    const token = jwt.sign(
      {
        type: 'admin',
        user: {
          _id: '123',
          email: 'user@email.com'
        }
      }, secrets)

    localStorage.setItem('accessToken', token)
    const pinia = createPinia().use(useAdminsStore)
    app.use(pinia)
    setActivePinia(createPinia())
  })

  test('test success getOne admin', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const store = adminStore()
    const res = await store.readOne()
    expect(res._id).toEqual('12test12')
  })

  test('test error getOne admin missing id', async () => {
    const token = jwt.sign(
      {
        type: 'admin',
        user: {
          email: 'user@email.com'
        }
      }, secrets)

    localStorage.setItem('accessToken', token)
    const adminStore = useAdminsStore(mokeConnector())
    const store = adminStore()
    const res = await store.readOne()
    expect(res.message).toEqual('Admin ID Is Required')
  })

  test('test success List', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const store = adminStore()
    await store.loadPage(1)
    expect(store.count).toEqual(4)
  })

  test('test success deleteOne', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const store = adminStore()
    await store.loadPage(1)
    await store.delete(store.items[0]._id)
    expect(store.items.length).toEqual(3)
    expect(store.items[0].data.name).toEqual('user2')
  })

  test('test success delete ', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const store = adminStore()
    await store.loadPage(1)
    const res = await store.deleteOne({ id: store.items[0]._id, password: 123123 })
    expect(res).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
  })

  test('test error delete ', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const store = adminStore()
    await store.loadPage(1)
    const res = await store.deleteOne({})
    expect(res.message).toEqual('Password Is Required')
  })

  test('test login error invalid ', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.login()
    expect(res.message).toEqual('Admin Email And Password Is Required')
  })

  test('test success login', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    await userStore.login('user1@gmail.com', '12123password')
    const token = jwt.sign({ type: 'admin', user: { _id: '12test12', email: 'user1@gmail.com' } }, secrets)
    expect(userStore.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(userStore.accessToken).toEqual(token)
  })

  test('test logOut', async () => {
    const token = jwt.sign({ type: 'token', data: 'token' }, secrets)
    localStorage.setItem('accessToken', token)
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.accessToken = 'token'
    userStore.user = { name: 'test' }
    await userStore.logout()
    expect(userStore.user).toEqual(null)
    expect(userStore.accessToken).toEqual(null)
  })

  test('test success send forgot Password', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.sendForgotPassword('user1@gmail.com')
    expect(res.success).toEqual(true)
  })

  test('test send forgot Password fail email required ', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.sendForgotPassword()
    expect(res.message).toEqual('Email Is Required')
  })

  test('test success reset forgot Password', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    await userStore.resetForgotPassword('forgotPasswordToken', 'newPassword', 'newPassword')
    const token = jwt.sign({ type: 'admin', user: { _id: '12test12', email: 'user1@gmail.com' } }, secrets)
    expect(userStore.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(userStore.accessToken).toEqual(token)
  })

  test('test reset forgot Password fail password is required', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.resetForgotPassword('forgotPasswordToken', 'newPassword')
    expect(res.message).toEqual('Admin Password Is Required')
  })

  test('test success send admin Invitation', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.sendInvitation('user1@gmail.com')
    expect(res.success).toEqual(true)
  })

  test('test success send admin Invitation', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.reSendInvitation('user1@gmail.com')
    expect(res.success).toEqual(true)
  })

  test('test send admin Invitation fail email required ', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.sendInvitation()
    expect(res.message).toEqual('Email Is Required')
  })

  test('test resend admin Invitation fail email required ', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.reSendInvitation()
    expect(res.message).toEqual('Email Is Required')
  })

  test('test success accept invitation', async () => {
    window.location.pathname = '/system-admins'
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    await userStore.acceptInvitation('acceptInvitationToken', 'newPassword', 'newPassword')
    const token = jwt.sign({ type: 'admin', user: { _id: '12test12', email: 'user1@gmail.com' } }, secrets)
    expect(userStore.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(userStore.accessToken).toEqual(token)
  })

  test('test accept invitation fail password is required', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.acceptInvitation('acceptInvitationToken', 'newPassword')
    expect(res.message).toEqual('Admin Password Is Required')
  })

  test('test success refresh Access Token', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.user = { _id: '12test12' }
    await userStore.refreshAccessToken()
    const token = jwt.sign({ type: 'admin', user: { _id: '12test12', email: 'user1@gmail.com' } }, secrets)
    expect(userStore.accessToken).toEqual(token)
  })

  test('test refresh Access Token fail user id required', async () => {
    localStorage.removeItem('accessToken')
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.refreshAccessToken()
    expect(res.message).toEqual('Admin ID Is Required')
  })

  test('test success patchName', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.user = { _id: '12test12', name: 'user1' }
    await userStore.patchName('user2')
    expect(userStore.user.name).toEqual('user2')
  })

  test('test patchName fail admin id required ', async () => {
    localStorage.removeItem('accessToken')
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.patchName('user2')
    expect(res.message).toEqual('Admin ID Is Required')
  })

  test('test patchName fail admin new name required ', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.user = { _id: '12test12', name: 'user1' }
    const res = await userStore.patchName()
    expect(res.message).toEqual('Admin ID And New Name Is Required')
  })

  test('test success patchPassword', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.user = { _id: '12test12' }
    const res = await userStore.patchPassword('oldPassword', 'newPassword', 'newPassword')
    expect(res).toEqual('success')
  })

  test('test patchPassword fail admin id required ', async () => {
    localStorage.removeItem('accessToken')
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.patchPassword('oldPassword', 'newPassword')
    expect(res.message).toEqual('Admin ID Is Required')
  })

  test('test patchPassword fail admin password required ', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.user = { _id: '12test12' }
    const res = await userStore.patchPassword('oldPassword', 'newPassword')
    expect(res.message).toEqual('Admin ID And New Password Is Required')
  })

  test('test success patchEmail', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.user = { _id: '12test12' }
    const res = await userStore.patchEmail('testEmail@gmail.com')
    expect(res).toEqual('success')
  })

  test('test patchEmail fail admin id required ', async () => {
    localStorage.removeItem('accessToken')
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.patchEmail('testEmail@gmail.com')
    expect(res.message).toEqual('Admin ID Is Required')
  })

  test('test success patchEmailConfirm', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.patchEmailConfirm('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6eyJfaWQiOiIxMnRlc3QxMiJ9LCJpYXQiOjE1MTYyMzkwMjJ9.IPlAzWLDie169M7SOxZIasOYlTvoZhjf0t5Agr_F5bU')
    expect(res).toEqual('success')
  })

  test('test patchEmailConfirm fail admin id required ', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.patchEmailConfirm('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc')
    expect(res.message).toEqual('Valid Token Is Required')
  })

  test('test success readOne', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.user = { _id: '12test12' }
    const res = await userStore.readOne()

    expect(res).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
  })

  test('test readOne fail admin id required ', async () => {
    localStorage.removeItem('accessToken')
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    const res = await userStore.readOne()
    expect(res.message).toEqual('Admin ID Is Required')
  })

  test('test success upload profilePicture', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.user = { _id: '12test12' }
    const res = await userStore.uploadProfilePicture({ profilePicture: 'test' })
    expect(res.profilePicture).toEqual('test')
  })

  test('test success delete profilePicture', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.user = { _id: '12test12', profilePicture: 'test' }
    const res = await userStore.deleteProfilePicture()
    expect(res.success).toEqual(true)
  })

  test('test upload profilePicture params error', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.user = { _id: '12test12' }
    const res = await userStore.uploadProfilePicture()
    expect(res.message).toEqual('param and form Data Is Required')
  })

  test('test success delete profilePicture params error', async () => {
    const adminStore = useAdminsStore(mokeConnector())
    const userStore = adminStore()
    userStore.user = { }
    const res = await userStore.deleteProfilePicture()
    expect(res.message).toEqual('User Id Is Required')
  })
})
