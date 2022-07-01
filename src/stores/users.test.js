import { createApp } from 'vue'
import { test, beforeEach, expect, describe } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import users from './users.js'
import RouteError from '../errors/RouteError.js'

describe('users Store', () => {
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
        throw new RouteError('User ID Is Required')
      }
      return { name: 'user1', email: 'user1@gmail.com', _id: '12test12' }
    }

    return {
      user: { list: mockList, deleteOne: mockDeleteOne }
    }
  }

  beforeEach(() => {
    const pinia = createPinia().use(users)
    app.use(pinia)
    setActivePinia(createPinia())
  })

  test('test success List', async () => {
    const usersStore = users(mokeConnector())
    const store = usersStore()
    await store.load()
    expect(store.count).toEqual(4)
  })

  test('test success DeleteOne', async () => {
    const usersStore = users(mokeConnector())
    const store = usersStore()
    await store.load()
    await store.deleteOne(store.items[0]._id)
    expect(store.items.length).toEqual(3)
    expect(store.items[0].data.name).toEqual('user2')
  })
})
