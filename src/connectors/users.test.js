import { test, beforeEach, expect, describe, vi } from 'vitest'

import users from './users.js'

const apiUrl = 'https:/mua/accounts'

describe('test accounts connectors', () => {
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

  beforeEach(async () => {
    localStorage.setItem('accessToken', 'Token')
  })

  test('test list users', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { items: [{ _id: '123', name: 'accountName1', email: 'example@gmail.com' }], count: 1 } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.list({ accountId: '123' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123/users',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })

    expect(res).toEqual({ items: [{ _id: '123', name: 'accountName1', email: 'example@gmail.com' }], count: 1 })
  })

  test('test get config', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { accountsAppUrl: 'https://accountsAPPUrl', appUrl: 'https://AppUrl', role: ['admin', 'user'] } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).config.getConfig()

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/config',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ accountsAppUrl: 'https://accountsAPPUrl', appUrl: 'https://AppUrl', role: ['admin', 'user'] })
  })

  test('test list users Error', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { items: [{ _id: '123', name: 'accountName1', email: 'example@gmail.com' }], count: 1 } })
    })

    await expect(users(fetch, apiUrl).user.list()).rejects.toThrowError('Account ID Is Required')
  })

  test('test readOne user', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', email: 'example@gmail.com' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.readOne({ id: '123', accountId: '112233' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/112233/users/123',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ _id: '123', name: 'accountName1', email: 'example@gmail.com' })
  })

  test('test readOne account error route error', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', email: 'example@gmail.com' } })
    })

    await expect(users(fetch, apiUrl).user.readOne()).rejects.toThrowError('ID And Account ID Is Required')
  })

  test('test getAccessToken ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { accessToken: 'Token' } })
    })
    localStorage.setItem('loginToken', 'Token')

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.getAccessToken({ id: '123', accountId: '112233' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/112233/users/123/access-token',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ accessToken: 'Token' })
  })

  test('test getAccessToken without id ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { accessToken: 'Token' } })
    })
    await expect(users(fetch, apiUrl).user.getAccessToken({ accountId: '112233' })).rejects.toThrowError('ID And Account ID Is Required')
  })

  test('test get accounts login ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.loginGetAccounts({ email: 'user1@gmail.com' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/login',
      {
        method: 'POST',
        body: JSON.stringify({ email: 'user1@gmail.com' }),
        headers: { 'Content-Type': 'application/json' }
      })
    expect(res).toEqual({ success: true })
  })

  test('test login get accounts with undefined input admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    await expect(users(fetch, apiUrl).user.loginGetAccounts()).rejects.toThrowError('User Email Is Required')
  })

  test('test login ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    localStorage.setItem('loginToken', 'Token')
    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.login({ accountId: '123', password: 'userPassword' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123/login',
      {
        method: 'POST',
        body: JSON.stringify({ password: 'userPassword' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual('Token')
  })

  test('test login with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    await expect(users(fetch, apiUrl).user.login()).rejects.toThrowError('User Password Is Required')
  })

  test('test patchName account', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', email: 'example@gmail.com' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.patchName({ id: '123', accountId: '112233', name: 'updateUserName' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/112233/users/123/name',
      {
        method: 'PATCH',
        body: JSON.stringify({ name: 'updateUserName' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ _id: '123', name: 'accountName1', email: 'example@gmail.com' })
  })

  test('test patchName with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(users(fetch, apiUrl).user.patchName()).rejects.toThrowError('User ID, Account ID And New Name Is Required')
  })

  test('test patchPassword account', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', email: 'example@gmail.com' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.patchPassword({ id: '123', accountId: '112233', oldPassword: 'oldPassword', newPassword: 'newPassword', newPasswordAgain: 'newPassword' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/112233/users/123/password',
      {
        method: 'PATCH',
        body: JSON.stringify({ oldPassword: 'oldPassword', newPassword: 'newPassword', newPasswordAgain: 'newPassword' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ _id: '123', name: 'accountName1', email: 'example@gmail.com' })
  })

  test('test patchPassword with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(users(fetch, apiUrl).user.patchPassword()).rejects.toThrowError('User ID, Account ID And New Password Is Required')
  })

  test('test patchRole account', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.patchRole({ id: '123', accountId: '112233' }, { role: 'admin' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/112233/users/123/role',
      {
        method: 'PATCH',
        body: JSON.stringify({ role: 'admin' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test patchRole with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(users(fetch, apiUrl).user.patchRole({}, {})).rejects.toThrowError('User ID, Account ID And New Role Is Required')
  })

  test('test deleteOne ', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'Name1', email: 'email@gmail.com' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.deleteOne({ id: '123', accountId: '112233' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/112233/users/123',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })

    expect(res).toEqual({ _id: '123', name: 'Name1', email: 'email@gmail.com' })
  })

  test('test deleteOne without id ', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' } })
    })

    await expect(users(fetch, apiUrl).user.deleteOne()).rejects.toThrowError('User ID and Account ID Is Required')
  })

  test('test success patchEmail ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.patchEmail({ id: '123', accountId: '112233', newEmail: 'newEmail@gmail.com', newEmailAgain: 'newEmail@gmail.com' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/112233/users/123/email',
      {
        method: 'PATCH',
        body: JSON.stringify({ newEmail: 'newEmail@gmail.com', newEmailAgain: 'newEmail@gmail.com' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test patchEmail with undefined input', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    await expect(users(fetch, apiUrl).user.patchEmail({})).rejects.toThrowError('User ID, Account ID, New Email and New Email Confirm Is Required')
  })

  test('test success patchEmailConfirm ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.patchEmailConfirm({ id: '123', accountId: '112233', token: 'token' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/112233/users/123/email-confirm',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + 'token'
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test patchEmailConfirm with undefined input admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    await expect(users(fetch, apiUrl).user.patchEmailConfirm({})).rejects.toThrowError('User ID, Account ID and token Is Required')
  })
})
