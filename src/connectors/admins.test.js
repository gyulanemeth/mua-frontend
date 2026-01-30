import { test, beforeEach, expect, describe, vi } from 'vitest'

import admin from './admins.js'

describe('test admin connectors', () => {
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

  const apiUrl = 'https:/mua/admin'
  beforeEach(async () => {
    localStorage.setItem('accessToken', 'Token')
  })

  test('test list admins', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { items: [{ _id: '123', name: 'user1', email: 'user1@gamil.com' }], count: 1 } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.list()

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })

    expect(res).toEqual({ items: [{ _id: '123', name: 'user1', email: 'user1@gamil.com' }], count: 1 })
  })

  test('test list admins with query', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { items: [{ _id: '123', name: 'user1', email: 'user1@gamil.com' }], count: 1 } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.list({}, { $text: { $search: 'user1' } })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins?$text[$search]=user1',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })

    expect(res).toEqual({ items: [{ _id: '123', name: 'user1', email: 'user1@gamil.com' }], count: 1 })
  })

  test('test readOne admin', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'user1', email: 'user1@gamil.com' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.readOne({ id: '123' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/123',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ _id: '123', name: 'user1', email: 'user1@gamil.com' })
  })

  test('test readOne admin Error no Id', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'user1', email: 'user1@gamil.com' } })
    })

    await expect(admin(fetch, apiUrl).admins.readOne()).rejects.toThrowError('Admin id is required')
  })

  test('test getAccessToken admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { accessToken: 'Token' } })
    })

    localStorage.setItem('loginToken', 'Token')

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.getAccessToken({ id: '123' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/123/access-token',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ accessToken: 'Token' })
  })

  test('test getAccessToken admin id Error', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { accessToken: 'Token' } })
    })

    await expect(admin(fetch, apiUrl).admins.getAccessToken()).rejects.toThrowError('Admin id is required')
  })

  test('test delete admin', async () => {
    const fetch = vi.fn()
    localStorage.setItem('delete-permission-token', 'token')

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'user1', email: 'user1@gamil.com' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.deleteOne({ id: '123' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/123',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token'
        }
      })

    expect(res).toEqual({ _id: '123', name: 'user1', email: 'user1@gamil.com' })
  })

  test('test delete without id admin', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { id: '123', name: 'user1', email: 'user1@gamil.com' } })
    })

    await expect(admin(fetch, apiUrl).admins.deleteOne()).rejects.toThrowError('Admin id is required')
  })

  test('test patchName admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.patchName({ id: '123', name: 'newUserName' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/123/name',
      {
        method: 'PATCH',
        body: JSON.stringify({ name: 'newUserName' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test patchName with undefined input admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    await expect(admin(fetch, apiUrl).admins.patchName({ id: '123' })).rejects.toThrowError('Admin id and new name Required')
  })

  test('test patchPassword admin', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.patchPassword({ id: '123', oldPassword: 'oldPassword', newPassword: 'newPassword', newPasswordAgain: 'newPassword' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/123/password',
      {
        method: 'PATCH',
        body: JSON.stringify({ oldPassword: 'oldPassword', newPassword: 'newPassword', newPasswordAgain: 'newPassword' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test patchPassword with undefined input admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    await expect(admin(fetch, apiUrl).admins.patchPassword({ id: '123', newPasswordAgain: 'newPassword' })).rejects.toThrowError('Admin id, old password, new password and password confirmation are required')
  })

  test('test login admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.login({ email: 'user1@gmail.com', password: 'user1Password' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/login/',
      {
        method: 'POST',
        body: JSON.stringify({ email: 'user1@gmail.com', password: 'user1Password' }),
        headers: { 'Content-Type': 'application/json' }
      })
    expect(res.loginToken).toEqual('Token')
  })

  test('test login admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { twoFactorLoginToken: 'Token' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.login({ email: 'user1@gmail.com', password: 'user1Password' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/login/',
      {
        method: 'POST',
        body: JSON.stringify({ email: 'user1@gmail.com', password: 'user1Password' }),
        headers: { 'Content-Type': 'application/json' }
      })
    expect(res.twoFactorLoginToken).toEqual('Token')
  })

  test('test getMFA admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.getMFA({ id: 'userId' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/userId/mfa',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res.success).toEqual(true)
  })

  test('test getMFA admin missing params ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(admin(fetch, apiUrl).admins.getMFA()).rejects.toThrowError('ID is required')
  })

  test('test disableMFA admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.disableMFA({ id: 'userId' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/userId/mfa',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res.success).toEqual(true)
  })

  test('test disableMFA admin missing params ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(admin(fetch, apiUrl).admins.disableMFA()).rejects.toThrowError('ID is required')
  })

  test('test confirmMFA admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.confirmMFA({ id: 'userId' }, { code: 'test' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/userId/mfa',
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
    await expect(admin(fetch, apiUrl).admins.confirmMFA()).rejects.toThrowError('ID and code are required')
  })

  test('test MFALogin admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.MFALogin({ code: '123132' }, { code: 'test' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/mfa-login',
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

  test('test MFALogin recoveryCode admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.MFALogin({ recoveryCode: '123132' }, { code: 'test' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/mfa-login',
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

  test('test MFALogin admin missing params ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })
    await expect(admin(fetch, apiUrl).admins.MFALogin()).rejects.toThrowError('Two factor code is required')
  })

  test('test login with provider ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { redirectUrl: 'link' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.loginWithProvider({})
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/login/provider',
      {
        method: 'POST',
        body: undefined,
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
    const res = await admin(fetch, apiUrl).admins.linkToProvider({ id: 'userId' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/userId/link',
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
    await expect(admin(fetch, apiUrl).admins.linkToProvider()).rejects.toThrowError('Admin id is required')
  })

  test('test disconnect ', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'Name1', email: 'email@gmail.com' } })
    })

    localStorage.setItem('admin-disconnect-permission-token', 'permissionToken')
    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.disconnectProvider({ id: '123', accountId: '112233', provider: 'google' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/123/provider/google',
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

    await expect(admin(fetch, apiUrl).admins.disconnectProvider()).rejects.toThrowError('Admin id is required')
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
    const res = await admin(fetch, apiUrl).admins.disconnectPermission('142536')

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/permission/disconnect',
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

  test('test disconnect permission error ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { permissionToken: 'permissionToken' } })
    })
    await expect(admin(fetch, apiUrl).admins.disconnectPermission()).rejects.toThrowError('Password is required')
  })

  test('test login with undefined input admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    await expect(admin(fetch, apiUrl).admins.login()).rejects.toThrowError('Admin email and password are required')
  })

  test('test sendInvitation admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).invitation.send({ email: 'newUser@gmail.com', confirmEmail: 'newUser@gmail.com' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/invitation/send',
      {
        method: 'POST',
        body: JSON.stringify({ email: 'newUser@gmail.com', confirmEmail: 'newUser@gmail.com' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test reSendInvitation admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).invitation.reSend({ email: 'newUser@gmail.com' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/invitation/resend',
      {
        method: 'POST',
        body: JSON.stringify({ email: 'newUser@gmail.com' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test sendInvitation undefined input admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    await expect(admin(fetch, apiUrl).invitation.send()).rejects.toThrowError('Email and email confirmation are required')
  })

  test('test reSendInvitation undefined input admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    await expect(admin(fetch, apiUrl).invitation.reSend()).rejects.toThrowError('Email is required')
  })

  test('test accept invitation admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'token' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).invitation.accept({ token: 'token', newPassword: 'newPassword', newPasswordAgain: 'newPassword', name: 'newName' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/invitation/accept',
      {
        method: 'POST',
        body: JSON.stringify({ newPassword: 'newPassword', newPasswordAgain: 'newPassword', name: 'newName' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('loginToken')
        }
      })
    expect(res).toEqual('token')
  })

  test('test accept invitation without password admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    await expect(admin(fetch, apiUrl).invitation.accept()).rejects.toThrowError('New password, password confirmation, name and token Required')
  })

  test('test forgotPassword send admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).forgotPassword.send({ email: 'user1@gmail.com' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/forgot-password/send',
      {
        method: 'POST',
        body: JSON.stringify({ email: 'user1@gmail.com' }),
        headers: { 'Content-Type': 'application/json' }
      })
    expect(res).toEqual({ success: true })
  })

  test('test forgotPassword send without email admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    await expect(admin(fetch, apiUrl).forgotPassword.send()).rejects.toThrowError('Email is required')
  })

  test('test forgotPassword reset admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'token' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).forgotPassword.reset({ token: 'token', newPassword: 'newPassword', newPasswordAgain: 'newPassword' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/forgot-password/reset',
      {
        method: 'POST',
        body: JSON.stringify({ newPassword: 'newPassword', newPasswordAgain: 'newPassword' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('loginToken')
        }
      })
    expect(res).toEqual('token')
  })

  test('test forgotPassword reset with undefined input admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    await expect(admin(fetch, apiUrl).forgotPassword.reset()).rejects.toThrowError('Admin password and password confirmation are required')
  })

  test('test success patchEmail ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.patchEmail({ id: '123', newEmail: 'newEmail@gmail.com', newEmailAgain: 'newEmail@gmail.com' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/123/email',
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

  test('test patchEmail with undefined input admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    await expect(admin(fetch, apiUrl).admins.patchEmail({})).rejects.toThrowError('Admin id, new email and email confirmation are required')
  })

  test('test success patchEmailConfirm ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.patchEmailConfirm({ id: '123', token: 'token' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/123/email-confirm',
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

    await expect(admin(fetch, apiUrl).admins.patchEmailConfirm({})).rejects.toThrowError('Admin id and token are required')
  })

  test('test get delete permission admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { permissionToken: 'permissionToken' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.deletePermission(142536)
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/permission/delete',
      {
        method: 'POST',
        body: JSON.stringify({ password: 142536 }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer Token'
        }
      })
    expect(res).toEqual(undefined)
  })

  test('test deleteMyAccount admin error ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { permissionToken: 'permissionToken' } })
    })
    await expect(admin(fetch, apiUrl).admins.deletePermission()).rejects.toThrowError('Password is required')
  })

  test('test upload admin profilePicture', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const formData = new FormData()
    formData.append('profilePicture', { profilePicture: 'test' })
    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.uploadProfilePicture({ id: '123' }, { profilePicture: 'test' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/123/profile-picture/',
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test upload admin profilePicture error ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { permissionToken: 'permissionToken' } })
    })
    await expect(admin(fetch, apiUrl).admins.uploadProfilePicture()).rejects.toThrowError('Param and form data are required')
  })

  test('test delete admin profilePicture', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await admin(fetch, apiUrl).admins.deleteProfilePicture({ id: '123' }, { profilePicture: 'test' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/admin/v1/system-admins/123/profile-picture',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test delete admin profilePicture error ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { permissionToken: 'permissionToken' } })
    })
    await expect(admin(fetch, apiUrl).admins.deleteProfilePicture()).rejects.toThrowError('User id is required')
  })
})
