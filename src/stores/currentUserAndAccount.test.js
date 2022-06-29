import { test, beforeEach, expect, describe, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import jwt from 'jsonwebtoken'
import { createApp } from 'vue'
import currentUserAndAccount from './currentUserAndAccount.js'
import RouteError from '../errors/RouteError.js'
describe('Current User And Account Store', () => {
  const app = createApp({})
  const secrets = 'verylongsecret1'

  const mokeConnector = () => {
    const mockLoginGetAccounts = (formData) => {
      if (formData === undefined || formData.email === undefined) {
        throw new RouteError('User Email Is Required')
      }
      return { success: true }
    }

    const mockLogin = (formData) => {
      if (formData === undefined || formData.password === undefined || formData.accountId === undefined) {
        throw new RouteError('User Password Is Required')
      }
      const token = jwt.sign({ type: 'login', user: { _id: '12test12', email: 'user1@gmail.com' }, account: { _id: '112233' } }, secrets)
      return token
    }

    const mockSendForgetPasssword = (data) => {
      if (data === undefined || data.email === undefined || data.id === undefined) {
        throw new RouteError('Email Is Required')
      }
      return { success: true }
    }

    const mockReset = async function (formData) {
      if (formData === undefined || formData.id === undefined || formData.token === undefined || formData.newPassword === undefined || formData.newPasswordAgain === undefined) {
        throw new RouteError('User Password Is Required')
      }
      const token = jwt.sign({ type: 'login', user: { _id: '12test12', email: 'user@email.com', accountId: '112233' } }, secrets)
      return token
    }

    const mockSendInvitation = async function (data) {
      if (data === undefined || data.id === undefined || data.email === undefined) {
        throw new RouteError('Email Is Required')
      }
      return { success: true }
    }

    const mockAccept = async function (formData) {
      if (formData === undefined || formData.id === undefined || formData.token === undefined || formData.newPassword === undefined || formData.newPasswordAgain === undefined) {
        throw new RouteError('Accouunt Password Is Required')
      }
      const token = jwt.sign({ type: 'login', user: { _id: '12test12', email: 'user@email.com', accountId: '112233' } }, secrets)
      return token
    }

    const mockUserReadOne = (data) => {
      if (data === undefined || data.accountId === undefined || data.id === undefined) {
        throw new RouteError('ID And Account ID Is Required')
      }
      return { name: 'user1', email: 'user1@gmail.com', _id: '12test12' }
    }
    const mockAccountReadOne = (id) => {
      if (id === undefined) {
        throw new RouteError('Admin ID Is Required')
      }
      return { name: 'user1', urlFriendlyName: 'urlFriendlyName1', _id: '12test12' }
    }

    const mockPatchUserName = async function (data) {
      if (data === undefined || data.id === undefined || data.accountId === undefined || data.name === undefined) {
        throw new RouteError('User ID, Account ID And New Name Is Required')
      }
      return data.name
    }
    const mockPatchAccountName = async function (formData) {
      if (formData === undefined || formData.id === undefined || formData.name === undefined) {
        throw new RouteError('Account ID And New Name Is Required')
      }
      return formData.name
    }
    const mockPatchAccountUrlFriendlyName = async function (formData) {
      if (formData === undefined || formData.id === undefined || formData.urlFriendlyName === undefined) {
        throw new RouteError('Account ID And New urlFriendlyName Is Required')
      }
      return formData.urlFriendlyName
    }

    const mockPatchPassword = async function (formData) {
      if (formData === undefined || formData.id === undefined || formData.accountId === undefined || formData.oldPassword === undefined || formData.newPassword === undefined || formData.newPasswordAgain === undefined) {
        throw new RouteError('User ID, Account ID And New Password Is Required')
      }
      return { success: true }
    }

    const mockgetAccessToken = (data) => {
      if (data === undefined || data.accountId === undefined || data.id === undefined) {
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

    return {
      account: { patchName: mockPatchAccountName, patchUrlFriendlyName: mockPatchAccountUrlFriendlyName, readOne: mockAccountReadOne },
      invitation: { send: mockSendInvitation, accept: mockAccept },
      forgotPassword: { send: mockSendForgetPasssword, reset: mockReset },
      user: { patchName: mockPatchUserName, patchPassword: mockPatchPassword, getAccessToken: mockgetAccessToken, login: mockLogin, loginGetAccounts: mockLoginGetAccounts, readOne: mockUserReadOne }
    }
  }

  beforeEach(() => {
    const pinia = createPinia().use(currentUserAndAccount)
    app.use(pinia)
    setActivePinia(createPinia())
  })

  test('test success login', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    await store.login('token', '12123password', '112233')
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    expect(store.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(store.accessToken).toEqual(token)
  })

  test('test login error invalid ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    const res = await store.login()
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    expect(res.message).toEqual('User Password Is Required')
    expect(store.user).toEqual(null)
    expect(store.accessToken).toEqual(null)
  })

  test('test logOut', async () => {
    localStorage.setItem('accessToken', 'Token')
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.accessToken = 'token'
    store.user = { name: 'test' }
    const res = await store.logout()
    expect(store.user).toEqual(null)
    expect(store.accessToken).toEqual(null)
  })

  test('test success send forgot Password', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const res = await store.sendForgotPassword('user1@gmail.com')
    expect(res).toEqual('success')
  })

  test('test send forgot Password fail email required ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const res = await store.sendForgotPassword()
    expect(res.message).toEqual('Email Is Required')
  })

  test('test success reset forgot Password', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const res = await store.resetForgotPassword('forgotPasswordToken', 'newPassword', 'newPassword')
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    expect(res).toEqual('success')
    expect(store.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(store.accessToken).toEqual(token)
  })

  test('test reset forgot Password fail password is required', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const res = await store.resetForgotPassword('forgotPasswordToken', 'newPassword')
    expect(res.message).toEqual('User Password Is Required')
  })

  test('test success send admin Invitation', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const res = await store.sendInvitation('user1@gmail.com')
    expect(res).toEqual('success')
  })

  test('test send admin Invitation fail email required ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const res = await store.sendInvitation()
    expect(res.message).toEqual('Email Is Required')
  })

  test('test success accept invitation', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const res = await store.acceptInvitation('acceptInvitationToken', 'newPassword', 'newPassword')
    const token = jwt.sign(
      { type: 'user', user: { _id: '123', email: 'user@email.com' }, account: { _id: '112233', urlFriendlyName: 'urlFriendlyName1' }, role: 'admin' }, secrets)
    expect(res).toEqual('success')
    expect(store.user).toEqual({ name: 'user1', email: 'user1@gmail.com', _id: '12test12' })
    expect(store.accessToken).toEqual(token)
  })

  test('test accept invitation fail password is required', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.account = { _id: '12test12' }
    const res = await store.acceptInvitation('acceptInvitationToken', 'newPassword')
    expect(res.message).toEqual('Accouunt Password Is Required')
  })

  test('test success patchUserName', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchUserName('user2')
    expect(res).toEqual('success')
    expect(store.user.name).toEqual('user2')
  })

  test('test patchUserName fail  id required ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.account = { _id: '123123' }
    const res = await store.patchUserName('user2')
    expect(res.message).toEqual('User ID Is Required')
  })

  test('test patchUserName fail  new name required ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchUserName()
    expect(res.message).toEqual('User ID, Account ID And New Name Is Required')
  })

  test('test success patchUrlFriendlyName', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123', urlFriendlyName: 'urlFriendlyName1' }
    const res = await store.patchUrlFriendlyName('urlFriendlyName2')
    expect(res).toEqual('success')
    expect(store.account.urlFriendlyName).toEqual('urlFriendlyName2')
  })

  test('test patchUrlFriendlyName fail  id required ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    const res = await store.patchUrlFriendlyName('urlFriendlyName2')
    expect(res.message).toEqual('account ID Is Required')
  })

  test('test patchUrlFriendlyName fail  new name required ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchUrlFriendlyName()
    expect(res.message).toEqual('Account ID And New urlFriendlyName Is Required')
  })

  test('test success patchAccountName', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123', name: 'account1' }
    const res = await store.patchAccountName('account2')
    expect(res).toEqual('success')
    expect(store.account.name).toEqual('account2')
  })

  test('test patchAccountName fail  id required ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.account = { _id: '123123' }
    const res = await store.patchAccountName('user2')
    expect(res.message).toEqual('User ID Is Required')
  })

  test('test patchAccountName fail  new name required ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchAccountName()
    expect(res.message).toEqual('Account ID And New Name Is Required')
  })

  test('test success patchPassword', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchPassword('oldPassword', 'newPassword', 'newPassword')
    expect(res).toEqual('success')
  })

  test('test patchPassword fail  id required ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchPassword('oldPassword', 'newPassword')
    expect(res.message).toEqual('User ID, Account ID And New Password Is Required')
  })

  test('test patchPassword fail  password required ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.user = { _id: '12test12', name: 'user1' }
    store.account = { _id: '123123' }
    const res = await store.patchPassword('oldPassword', 'newPassword')
    expect(res.message).toEqual('User ID, Account ID And New Password Is Required')
  })

  test('test readOne success ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    store.account = { _id: '123123' }
    const res = await store.readOne()
    expect(res).toEqual({ name: 'user1', urlFriendlyName: 'urlFriendlyName1', _id: '12test12' })
  })

  test('test readOne account id undefined ', async () => {
    const currentUser = currentUserAndAccount(mokeConnector())
    const store = currentUser()
    const res = await store.readOne()
    expect(res.message).toEqual('account ID Is Required')
  })
})
