import { test, beforeEach, expect, describe, vi } from 'vitest'

import users from './users.js'

const apiUrl = 'https:/mua/'

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
    const res = await users(fetch, apiUrl).list({ accountId: '123' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/123/users',
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

    await expect(users(fetch, apiUrl).list()).rejects.toThrowError('Account ID Is Required')
  })

  test('test readOne user', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', email: 'example@gmail.com' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).readOne({ id: '123', accountId: '112233' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/112233/users/123',
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

    await expect(users(fetch, apiUrl).readOne()).rejects.toThrowError('ID And Account ID Is Required')
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
    const res = await users(fetch, apiUrl).getAccessToken({ id: '123', accountId: '112233' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/112233/users/123/access-token',
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
    await expect(users(fetch, apiUrl).getAccessToken({ accountId: '112233' })).rejects.toThrowError('ID And Account ID Is Required')
  })

  test('test get accounts login ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).loginGetAccounts({ email: 'user1@gmail.com' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/login',
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

    await expect(users(fetch, apiUrl).loginGetAccounts()).rejects.toThrowError('User Email Is Required')
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
    const res = await users(fetch, apiUrl).login({ accountId: '123', password: 'userPassword' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/123/login',
      {
        method: 'POST',
        body: JSON.stringify({ password: 'userPassword' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res.loginToken).toEqual('Token')
  })

  test('test login', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { twoFactorLoginToken: 'Token' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).login({ accountId: '123', password: 'userPassword' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/123/login',
      {
        method: 'POST',
        body: JSON.stringify({ password: 'userPassword' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res.twoFactorLoginToken).toEqual('Token')
  })

  test('test getMFA', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).getMFA({ accountId: '123', id: 'userId' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/123/users/userId/mfa',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res.success).toEqual(true)
  })

  test('test getMFA missing params ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(users(fetch, apiUrl).getMFA()).rejects.toThrowError('ID Is Required')
  })

  test('test disableMFA', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).disableMFA({ accountId: '123', id: 'userId' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/123/users/userId/mfa',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res.success).toEqual(true)
  })

  test('test disableMFA missing params ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(users(fetch, apiUrl).disableMFA()).rejects.toThrowError('ID Is Required')
  })

  test('test confirmMFA', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).confirmMFA({ accountId: '123', id: 'userId' }, { code: 'test' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/123/users/userId/mfa',
      {
        method: 'POST',
        body: JSON.stringify({ code: 'test' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res.success).toEqual(true)
  })

  test('test confirmMFA admin missing params ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(users(fetch, apiUrl).confirmMFA()).rejects.toThrowError('ID and Code Is Required')
  })

  test('test MFALogin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).MFALogin({ code: '123132' }, { code: 'test' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/mfa-login',
      {
        method: 'POST',
        body: JSON.stringify({ code: '123132' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual(true)
  })

  test('test MFALogin recoveryCode', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).MFALogin({ recoveryCode: '123132' }, { code: 'test' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/mfa-login',
      {
        method: 'POST',
        body: JSON.stringify({ recoveryCode: '123132' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual(true)
  })

  test('test MFALogin missing params ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(users(fetch, apiUrl).MFALogin()).rejects.toThrowError('Two Factor Code Is Required')
  })

  test('test listProjects', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).listProjects({ accountId: '123' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/123/projects-for-access',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res.success).toEqual(true)
  })

  test('test listProjects missing params ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(users(fetch, apiUrl).listProjects()).rejects.toThrowError('Account ID Is Required')
  })

  test('test login with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    await expect(users(fetch, apiUrl).login()).rejects.toThrowError('User Password Is Required')
  })

  test('test patchName account', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', email: 'example@gmail.com' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).patchName({ id: '123', accountId: '112233', name: 'updateUserName' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/112233/users/123/name',
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
    await expect(users(fetch, apiUrl).patchName()).rejects.toThrowError('User ID, Account ID And New Name Is Required')
  })

  test('test patchPassword account', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', email: 'example@gmail.com' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).patchPassword({ id: '123', accountId: '112233', oldPassword: 'oldPassword', newPassword: 'newPassword', newPasswordAgain: 'newPassword' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/112233/users/123/password',
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
    const res = await users(fetch, apiUrl).reSendfinalizeRegistrationEmail({ userId: '123', accountId: '112233' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/112233/users/123/resend-finalize-registration',
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
    await expect(users(fetch, apiUrl).reSendfinalizeRegistrationEmail()).rejects.toThrowError('User Id And Account Id Is Required')
  })

  test('test patchPassword with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(users(fetch, apiUrl).patchPassword()).rejects.toThrowError('User ID, Account ID And New Password Is Required')
  })

  test('test patchRole account', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).patchRole({ id: '123', accountId: '112233' }, { role: 'admin' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/112233/users/123/role',
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
    await expect(users(fetch, apiUrl).patchRole({}, {})).rejects.toThrowError('User ID, Account ID And New Role Is Required')
  })

  test('test deleteOne ', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'Name1', email: 'email@gmail.com' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).deleteOne({ id: '123', accountId: '112233' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/112233/users/123',
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

    await expect(users(fetch, apiUrl).deleteOne()).rejects.toThrowError('User ID and Account ID Is Required')
  })

  test('test success patchEmail ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).patchEmail({ id: '123', accountId: '112233', newEmail: 'newEmail@gmail.com', newEmailAgain: 'newEmail@gmail.com' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/112233/users/123/email',
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

    await expect(users(fetch, apiUrl).patchEmail({})).rejects.toThrowError('User ID, Account ID, New Email and New Email Confirm Is Required')
  })

  test('test success patchEmailConfirm ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).patchEmailConfirm({ id: '123', accountId: '112233', token: 'token' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/112233/users/123/email-confirm',
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

    await expect(users(fetch, apiUrl).patchEmailConfirm({})).rejects.toThrowError('User ID, Account ID and token Is Required')
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
    const res = await users(fetch, apiUrl).deletePermission('142536')

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/system-admins/permission/delete',
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
    const res = await users(fetch, apiUrl).deletePermission('142536')

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/permission/delete',
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
    await expect(users(fetch, apiUrl).deletePermission()).rejects.toThrowError('Password Is Required')
  })

  test('test upload user profilePicture ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).uploadProfilePicture({ id: '123test123', accountId: '112233Test' }, { test: 'test' })

    const formData = new FormData()
    formData.append('profilePicture', { test: 'test' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/112233Test/users/123test123/profile-picture',
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
    await expect(users(fetch, apiUrl).uploadProfilePicture()).rejects.toThrowError('param and form Data Is Required')
  })

  test('test delete user profilePicture ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).deleteProfilePicture({ id: '123test123', accountId: '1122test' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/1122test/users/123test123/profile-picture',
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
    await expect(users(fetch, apiUrl).deleteProfilePicture()).rejects.toThrowError('Account and User Id Is Required')
  })

  test('test login with urlFriendlyName ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).loginWithUrlFriendlyName({ urlFriendlyName: '123', password: 'userPassword', email: 'test@tes123.com' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/123/login/url-friendly-name',
      {
        method: 'POST',
        body: JSON.stringify({ password: 'userPassword', email: 'test@tes123.com' }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    expect(res.loginToken).toEqual('Token')
  })

  test('test login with urlFriendlyName ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { twoFactorLoginToken: 'Token' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).loginWithUrlFriendlyName({ urlFriendlyName: '123', password: 'userPassword', email: 'test@tes123.com' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/123/login/url-friendly-name',
      {
        method: 'POST',
        body: JSON.stringify({ password: 'userPassword', email: 'test@tes123.com' }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    expect(res.twoFactorLoginToken).toEqual('Token')
  })

  test('test login with urlFriendlyName undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(users(fetch, apiUrl).loginWithUrlFriendlyName()).rejects.toThrowError('User Password Is Required')
  })

  test('test login with provider ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { redirectUrl: 'link' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).loginWithProvider({ id: 'test-account', provider: 'test' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/test-account/login/provider/test',
      {
        method: 'POST',
        body: undefined,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    expect(res.redirectUrl).toEqual('link')
  })

  test('test login with provider undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(users(fetch, apiUrl).loginWithProvider()).rejects.toThrowError('Account id is Required')
  })

  test('test create with provider ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { redirectUrl: 'link' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).createWithProvider({ provider: 'test' }, { name: 'test' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/create-account/provider/test',
      {
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    expect(res.redirectUrl).toEqual('link')
  })

  test('test link with provider ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { redirectUrl: 'link' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).linkToProvider({ accountId: 'test-account', id: 'userId', provider: 'test' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/test-account/users/userId/link/provider/test',
      {
        method: 'POST',
        body: undefined,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    expect(res.redirectUrl).toEqual('link')
  })

  test('test link with provider undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(users(fetch, apiUrl).linkToProvider()).rejects.toThrowError('ccountId and user id is Required')
  })

  test('test create password', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { accessToken: 'Token' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).createPassword({ token: 'token', accountId: 'test-account', id: 'userId' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/test-account/users/userId/create-password',
      {
        method: 'PATCH',
        body: undefined,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token'
        }
      })
    expect(res.accessToken).toEqual('Token')
  })

  test('test create password undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(users(fetch, apiUrl).createPassword()).rejects.toThrowError('User ID, Account ID And Token Is Required')
  })

  test('test disconnect permission admin', async () => {
    localStorage.setItem('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.7leGQ_Qr3r-fI2lG2grYSpxmWCTI6zhTb_jrDrMhx8g')

    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { permissionToken: 'permissionToken' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).disconnectPermission('142536')

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/permission/disconnect',
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

  test('test delete permission error ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { permissionToken: 'permissionToken' } })
    })
    await expect(users(fetch, apiUrl).disconnectPermission()).rejects.toThrowError('Password Is Required')
  })

  test('test disconnect ', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'Name1', email: 'email@gmail.com' } })
    })

    localStorage.setItem('disconnect-permission-token', 'permissionToken')
    const spy = vi.spyOn(fetch, 'impl')
    const res = await users(fetch, apiUrl).disconnectProvider({ id: '123', accountId: '112233', provider: 'google' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua//v1/accounts/112233/users/123/provider/google',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer permissionToken'
        },
        body: undefined
      })

    expect(res).toEqual({ _id: '123', name: 'Name1', email: 'email@gmail.com' })
  })

  test('test disconnect without params ', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' } })
    })

    await expect(users(fetch, apiUrl).disconnectProvider()).rejects.toThrowError('User ID, Provider and Account ID Is Required')
  })
})
