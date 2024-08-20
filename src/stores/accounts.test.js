import { createApp } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { test, beforeEach, expect, describe } from 'vitest'

import jwt from 'jsonwebtoken'

import RouteError from '../errors/RouteError.js'

import useAccountsStore from './accounts.js'

const secrets = 'verylongsecret1'

describe('accounts Store', () => {
  global.window = {
    config: {
      apiBaseUrl: 'http://api.emailfox.link'
    },
    location: {
      pathname: ''
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
          { name: 'accountExample1', urlFriendlyName: 'urlFriendlyName1', _id: '12test12' },
          { name: 'accountExample2', urlFriendlyName: 'urlFriendlyName2', _id: '13test13' },
          { name: 'accountExample3', urlFriendlyName: 'urlFriendlyName3', _id: '14test14' }

        ],
        count: 3
      }
    }
    const mockCreateOneByAdmin = async function (formData) {
      if (!formData || !formData.name || !formData.urlFriendlyName) {
        throw new RouteError('FormData Name And UrlFriendlyName Is Required')
      }
      return { name: 'accountExampleNew', urlFriendlyName: 'urlFriendlyNameNew', _id: '112test112' }
    }

    const mockCreateOne = async function (formData) {
      if (!formData || !formData.account || !formData.account.name || !formData.account.urlFriendlyName) {
        throw new RouteError('Account Name And UrlFriendlyName Is Required')
      } else if (!formData.user || !formData.user.name || !formData.user.email || !formData.user.password) {
        throw new RouteError('User Name, Email And Password Is Required')
      }
      return { success: true }
    }

    const mockAccountReadOne = (id) => {
      if (!id) {
        throw new RouteError('Admin ID Is Required')
      }
      return { name: 'user1', urlFriendlyName: 'urlFriendlyName1', _id: '12test12' }
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

    const mockGetAccountByUrlFriendlyName = async function (params) {
      if (!params || !params.urlFriendlyName) {
        throw new RouteError('Account urlFriendlyName Is Required')
      }
      return 'success'
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

    const mockDeletePermission = (password) => {
      if (!password) {
        throw new RouteError('Password Is Required')
      }
      return { name: 'user1', email: 'user1@gmail.com', _id: '12test12' }
    }

    const mockDeleteAccount = async function (params) {
      if (!params || !params.id) {
        throw new RouteError('Account ID Is Required')
      }
      return { success: true }
    }

    return {
      account: { list: mockList, createOneByAdmin: mockCreateOneByAdmin, uploadLogo: mockUploadLogo, deleteLogo: mockDeleteLogo, getAccountByUrlFriendlyName: mockGetAccountByUrlFriendlyName, patchName: mockPatchAccountName, patchUrlFriendlyName: mockPatchAccountUrlFriendlyName, createOne: mockCreateOne, readOne: mockAccountReadOne, deleteOne: mockDeleteAccount },
      user: { deletePermission: mockDeletePermission }
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
    const pinia = createPinia().use(useAccountsStore)
    app.use(pinia)
    setActivePinia(createPinia())
  })

  test('test success List', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    await store.load()
    expect(store.count).toEqual(3)
  })

  test('test success createOne', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    const res = await store.createOneByAdmin({ name: 'testName', urlFriendlyName: 'testurlFriendlyName', logo: { test: 'success' } })
    expect(res).toEqual('success')
  })

  test('test createOne params error', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    const res = await store.createOneByAdmin({})
    expect(res.message).toEqual('FormData Name And UrlFriendlyName Is Required')
  })

  test('test success get account by urlFriendlyName', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    const res = await store.getAccountByUrlFriendlyName('12123password')
    expect(res).toEqual('success')
  })

  test('test get account by urlFriendlyName invalid input', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    const res = await store.getAccountByUrlFriendlyName()
    expect(res.message).toEqual('Account urlFriendlyName Is Required')
  })

  test('test success createOne', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    const res = await store.createAccount({ user: { name: 'test', email: 'email@123.com', password: 'testPass' }, account: { name: 'testName', urlFriendlyName: 'testurlFriendlyName' } })
    expect(res.success).toEqual(true)
  })

  test('test error createOne', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    const res = await store.createAccount()
    expect(res.message).toEqual('Account Name And UrlFriendlyName Is Required')
  })

  test('test success patchUrlFriendlyName', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = { _id: '123123', urlFriendlyName: 'urlFriendlyName1' }
    await store.patchUrlFriendlyName('urlFriendlyName2')
    expect(store.account.urlFriendlyName).toEqual('urlFriendlyName2')
  })

  test('test patchUrlFriendlyName fail  id required ', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = {}
    const res = await store.patchUrlFriendlyName('urlFriendlyName2')
    expect(res.message).toEqual('account ID Is Required')
  })

  test('test patchUrlFriendlyName fail  new name required ', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = { _id: '123123' }
    const res = await store.patchUrlFriendlyName()
    expect(res.message).toEqual('Account ID And New urlFriendlyName Is Required')
  })

  test('test success patchAccountName', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = { _id: '123123', name: 'account1' }
    await store.patchAccountName({ name: 'account2', user: { _id: '123123' } })
    expect(store.account.name).toEqual('account2')
  })

  test('test patchAccountName fail  id required ', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = {}
    const res = await store.patchAccountName({})
    expect(res.message).toEqual('User ID Is Required')
  })

  test('test patchAccountName fail  new name required ', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = { _id: '123123' }
    const res = await store.patchAccountName({ user: { _id: '123123' } })
    expect(res.message).toEqual('Account ID And New Name Is Required')
  })

  test('test readOne success ', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = { _id: '123123' }
    const res = await store.readOne()
    expect(res).toEqual({ name: 'user1', urlFriendlyName: 'urlFriendlyName1', _id: '12test12' })
  })

  test('test readOne success ', async () => {
    localStorage.setItem('accountId', '123123')
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = { _id: '123123' }
    const res = await store.readOne()
    expect(res).toEqual({ name: 'user1', urlFriendlyName: 'urlFriendlyName1', _id: '12test12' })
  })

  test('test readOne account id undefined ', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    localStorage.removeItem('accountId')
    store.account = {}
    const res = await store.readOne()
    expect(res.message).toEqual('account ID Is Required')
  })

  test('test error missing id deleteAccount', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = {}
    const res = await store.deleteAccount('123123')
    expect(res.message).toEqual('Account ID Is Required')
  })

  test('test success deleteAccount', async () => {
    const token = jwt.sign({ type: 'token', data: 'token' }, secrets)
    window.location.search = { token, accountId: '123test123' }
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = { _id: '123test123' }
    const res = await store.deleteAccount('123123')
    expect(res.success).toEqual(true)
  })

  test('test success deleteAccount', async () => {
    const token = jwt.sign({ type: 'token', data: 'token' }, secrets)
    localStorage.setItem('accessToken', token)
    window.location.search = { token, accountId: '123test123' }
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = { _id: '123test123' }
    const res = await store.deleteAccount('123123')
    expect(res.success).toEqual(true)
  })

  test('test success deleteAccount', async () => {
    const token = jwt.sign({ type: 'admin', account: { urlFriendlyName: 'urlFriendlyName1' } }, secrets)
    window.location.search = { token, accountId: '112233' }
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = { _id: '123test123' }
    const res = await store.deleteAccount('123123')
    expect(res.success).toEqual(true)
  })

  test('test success uploadLogo', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = { _id: '123test123' }
    const res = await store.uploadLogo({ logo: 'test' })
    expect(res.success).toEqual(true)
  })

  test('test success deleteLogo', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = { _id: '123test123' }
    const res = await store.deleteLogo()
    expect(res.success).toEqual(true)
  })

  test('test uploadLogo params error', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = {}
    const res = await store.uploadLogo()
    expect(res.message).toEqual('param and form Data Is Required')
  })

  test('test success logo params error', async () => {
    const accountStore = useAccountsStore(mokeConnector())
    const store = accountStore()
    store.account = {}
    const res = await store.deleteLogo()
    expect(res.message).toEqual('Account Id Is Required')
  })
})
