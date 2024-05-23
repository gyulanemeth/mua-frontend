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

  global.window = {
    config: {
      apiBaseUrl: 'http://api.emailfox.link'
    }
  }

  global.FormData = class FormData {
    constructor () {
      this.entries = []
    }

    append (key, value) {
      this.entries.push([key, value])
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

  test('test reSendfinalizeRegistrationEmail', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', email: 'example@gmail.com' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.reSendfinalizeRegistrationEmail({ userId: '123', accountId: '112233' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/112233/users/123/resend-finalize-registration',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    expect(res).toEqual({ _id: '123', name: 'accountName1', email: 'example@gmail.com' })
  })

  test('test reSendfinalizeRegistrationEmail with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(users(fetch, apiUrl).user.reSendfinalizeRegistrationEmail()).rejects.toThrowError('User Id And Account Id Is Required')
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
          Authorization: 'Bearer ' + localStorage.getItem('delete-permission-token')
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

  test('test delete permission admin', async () => {
    localStorage.setItem('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.7leGQ_Qr3r-fI2lG2grYSpxmWCTI6zhTb_jrDrMhx8g')

    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { permissionToken: 'permissionToken' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.deletePermission('142536')

    expect(spy).toHaveBeenLastCalledWith(
      'http://admins-api.emailfox.link/v1/admins/permission/delete',
      {
        method: 'POST',
        body: JSON.stringify({ password: '142536' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual(undefined)
  })

  test('test delete permission admin', async () => {
    localStorage.setItem('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidHlwZSI6InVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.XsGS9q8_wzQVn6-6n2XBT1r1-l6qAyY9EAXWj165OY4')

    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { permissionToken: 'permissionToken' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.deletePermission('142536')

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/permission/delete',
      {
        method: 'POST',
        body: JSON.stringify({ password: '142536' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual(undefined)
  })

  test('test delete permission admin error ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { permissionToken: 'permissionToken' } })
    })
    await expect(users(fetch, apiUrl).user.deletePermission()).rejects.toThrowError('Password Is Required')
  })

  test('test upload user profilePicture ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.uploadProfilePicture({ id: '123test123', accountId: '112233Test' }, { test: 'test' })

    const formData = new FormData()
    formData.append('profilePicture', { test: 'test' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/112233Test/users/123test123/profile-picture',
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test upload with undefined input ', async () => { // admin
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(users(fetch, apiUrl).user.uploadProfilePicture()).rejects.toThrowError('param and form Data Is Required')
  })

  test('test delete user profilePicture ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.deleteProfilePicture({ id: '123test123', accountId: '1122test' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/1122test/users/123test123/profile-picture',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test delete with undefined input ', async () => { // admin
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(users(fetch, apiUrl).user.deleteProfilePicture()).rejects.toThrowError('Account and User Id Is Required')
  })

  test('test login with urlFriendlyName ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).user.loginWithUrlFriendlyName({ urlFriendlyName: '123', password: 'userPassword', email: 'test@tes123.com' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123/login/url-friendly-name',
      {
        method: 'POST',
        body: JSON.stringify({ password: 'userPassword', email: 'test@tes123.com' }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    expect(res).toEqual('Token')
  })

  test('test login with urlFriendlyName undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(users(fetch, apiUrl).user.loginWithUrlFriendlyName()).rejects.toThrowError('User Password Is Required')
  })
})
