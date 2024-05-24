import { createApp } from 'vue'
import { test, beforeEach, expect, describe } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import useUsersStore from './users.js'
import RouteError from '../errors/RouteError.js'

describe('users Store', () => {
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

    return {
      list: mockList, deleteOne: mockDeleteOne, patchRole: mockPatchRole, deletePermission: mockDeletePermission
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
})
