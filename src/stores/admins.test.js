import { createApp } from 'vue'
import { test, beforeEach, expect, describe } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import useAdminsStore from './admins.js'
import RouteError from '../errors/RouteError.js'
import jwt from 'jsonwebtoken'

const secrets = 'verylongsecret1'


describe('admin Store', () => {
    const app = createApp({})

    global.localStorage = {
        data: {},
        getItem(key) {
            return this.data[key]
        },
        setItem(key, value) {
            this.data[key] = value
        },
        removeItem(key) {
            delete this.data[key]
        }
    }

    const token = jwt.sign(
        {
            type: 'admin',
            user: {
                _id: '123',
                email: 'user@email.com'
            }
        }, secrets)

    localStorage.setItem('accessToken', token)

    const mokeConnector = () => {

        const mockReadOne = (data) => {
            if (!data || !data.id) {
                throw new RouteError('Admin ID Is Required')
            }
            return { name: 'user1', email: 'user1@gmail.com', _id: '12test12' }
        }

        return {
            admin: { readOne: mockReadOne }
        }
    }

    beforeEach(() => {
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


})
