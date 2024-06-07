import { test, beforeEach, expect, describe, vi } from 'vitest'

import accounts from './accounts.js'

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

  test('test list accounts', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { items: [{ _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' }], count: 1 } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.list()

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })

    expect(res).toEqual({ items: [{ _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' }], count: 1 })
  })

  test('test get account by urlFriendlyName', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.getAccountByUrlFriendlyName({ urlFriendlyName: 'urlFriendlyNameExample1' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/by-url-friendly-name/urlFriendlyNameExample1',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })

    expect(res).toEqual({ _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' })
  })

  test('test get account by urlFriendlyName undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(accounts(fetch, apiUrl).account.getAccountByUrlFriendlyName()).rejects.toThrowError('Account UrlFriendlyName Is Required')
  })

  test('test readOne account', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.readOne({ id: '123' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' })
  })

  test('test check Availability account', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { available: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.checkAvailability({ urlFriendlyName: 'urlFriendlyNameExample1' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/check-availability?urlFriendlyName=urlFriendlyNameExample1',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    expect(res).toEqual({ available: true })
  })

  test('test check Availability with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(accounts(fetch, apiUrl).account.checkAvailability()).rejects.toThrowError('Account UrlFriendlyName Is Required')
  })

  test('test readOne account error route error', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' } })
    })

    await expect(accounts(fetch, apiUrl).account.readOne()).rejects.toThrowError('Admin ID Is Required')
  })

  test('test deleteOne account', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.deleteOne({ id: '123' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('delete-permission-token')
        }
      })

    expect(res).toEqual({ _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' })
  })

  test('test deleteOne without id ', async () => {
    const fetch = vi.fn()

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { _id: '123', name: 'accountName1', urlFriendlyName: 'urlFriendlyNameExample1' } })
    })

    await expect(accounts(fetch, apiUrl).account.deleteOne()).rejects.toThrowError('Account ID Is Required')
  })

  test('test patchName account', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.patchName({ id: '123', name: 'updateAccpuntName' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123/name',
      {
        method: 'PATCH',
        body: JSON.stringify({ name: 'updateAccpuntName' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test patchName with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(accounts(fetch, apiUrl).account.patchName({ id: '123' })).rejects.toThrowError('Account ID And New Name Is Required')
  })

  test('test patchUrlFriendlyName account', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.patchUrlFriendlyName({ id: '123', urlFriendlyName: 'updateUrlFriendlyName' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123/urlFriendlyName',
      {
        method: 'PATCH',
        body: JSON.stringify({ urlFriendlyName: 'updateUrlFriendlyName' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test patchUrlFriendlyName with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(accounts(fetch, apiUrl).account.patchUrlFriendlyName({ id: '123' })).rejects.toThrowError('Account ID And New urlFriendlyName Is Required')
  })

  test('test createOne account', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({
        result: {
          newUser: { name: 'userName', email: 'email@email.com', password: 'userPassword' },
          newAccount: { name: 'AccountName', urlFriendlyName: 'updateUrlFriendlyName' }
        }
      })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.createOne({ user: { name: 'userName', email: 'email@email.com', password: 'userPassword' }, account: { name: 'AccountName', urlFriendlyName: 'updateUrlFriendlyName' } })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/create',
      {
        method: 'POST',
        body: JSON.stringify({
          account: { name: 'AccountName', urlFriendlyName: 'updateUrlFriendlyName' },
          user: { name: 'userName', email: 'email@email.com', password: 'userPassword' }
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({
      newUser: { name: 'userName', email: 'email@email.com', password: 'userPassword' },
      newAccount: { name: 'AccountName', urlFriendlyName: 'updateUrlFriendlyName' }
    })
  })

  test('test createOne with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(accounts(fetch, apiUrl).account.createOne()).rejects.toThrowError('Account Name And UrlFriendlyName Is Required')
  })

  test('test createOne with undefined account input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(accounts(fetch, apiUrl).account.createOne({ account: { name: 'AccountName', urlFriendlyName: 'updateUrlFriendlyName' } })).rejects.toThrowError('User Name, Email And Password Is Required')
  })

  test('test finalizeRegistration account', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'test' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.finalizeRegistration({ id: '123', accountId: '112233', token: 'token' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/112233/users/123/finalize-registration',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token'
        }
      })
    expect(res).toEqual('test')
  })

  test('test finalizeRegistration with undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(accounts(fetch, apiUrl).account.finalizeRegistration()).rejects.toThrowError('User Id And Account Id Is Required')
  })

  test('test sendInvitation ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).invitation.send({ id: '123', email: 'newUser@gmail.com' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123/invitation/send',
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

  test('test reSendInvitation ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).invitation.reSend({ id: '123', email: 'User@gmail.com' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123/invitation/resend',
      {
        method: 'POST',
        body: JSON.stringify({ email: 'User@gmail.com' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test sendInvitation undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    await expect(accounts(fetch, apiUrl).invitation.send()).rejects.toThrowError('Email Is Required')
  })

  test('test sendInvitation undefined input ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    await expect(accounts(fetch, apiUrl).invitation.reSend()).rejects.toThrowError('Email Is Required')
  })

  test('test accept invitation ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).invitation.accept({ id: '123', token: 'Token', newPassword: 'newPassword', newPasswordAgain: 'newPassword', name: 'newName' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123/invitation/accept',

      {
        method: 'POST',
        body: JSON.stringify({ newPassword: 'newPassword', newPasswordAgain: 'newPassword', name: 'newName' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('loginToken')
        }
      })
    expect(res).toEqual('Token')
  })

  test('test accept invitation without password ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    await expect(accounts(fetch, apiUrl).invitation.accept()).rejects.toThrowError('Accouunt Password Is Required')
  })

  test('test forgotPassword send ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).forgotPassword.send({ id: '123', email: 'user1@gmail.com' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123/forgot-password/send',
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

    await expect(accounts(fetch, apiUrl).forgotPassword.send()).rejects.toThrowError('Email Is Required')
  })

  test('test forgotPassword reset admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).forgotPassword.reset({ id: '123', token: 'Token', newPassword: 'newPassword', newPasswordAgain: 'newPassword' })
    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123/forgot-password/reset',
      {
        method: 'POST',
        body: JSON.stringify({ newPassword: 'newPassword', newPasswordAgain: 'newPassword' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('loginToken')
        }
      })
    expect(res).toEqual('Token')
  })

  test('test forgotPassword reset with undefined input admin', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { loginToken: 'Token' } })
    })

    await expect(accounts(fetch, apiUrl).forgotPassword.reset()).rejects.toThrowError('User Password Is Required')
  })

  test('test upload account logo ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const formData = new FormData()
    formData.append('logo', { test: 'test' })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.uploadLogo({ id: '123test123' }, { test: 'test' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123test123/logo/',
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
    await expect(accounts(fetch, apiUrl).account.uploadLogo()).rejects.toThrowError('param and form Data Is Required')
  })

  test('test delete account logo ', async () => {
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.deleteLogo({ id: '123test123' }, { test: 'test' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts/123test123/logo',
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
    await expect(accounts(fetch, apiUrl).account.deleteLogo()).rejects.toThrowError('Account Id Is Required')
  })

  test('test createOneByAdmin account', async () => { // admin
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })

    const spy = vi.spyOn(fetch, 'impl')
    const res = await accounts(fetch, apiUrl).account.createOneByAdmin({ name: 'AccountName', urlFriendlyName: 'updateUrlFriendlyName' })

    expect(spy).toHaveBeenLastCalledWith(
      'https:/mua/accounts/v1/accounts',
      {
        method: 'POST',
        body: JSON.stringify({ name: 'AccountName', urlFriendlyName: 'updateUrlFriendlyName' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
    expect(res).toEqual({ success: true })
  })

  test('test createOneByAdmin with undefined input ', async () => { // admin
    const fetch = vi.fn()
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ result: { success: true } })
    })
    await expect(accounts(fetch, apiUrl).account.createOneByAdmin()).rejects.toThrowError('Name And UrlFriendlyName Is Required')
  })
})
