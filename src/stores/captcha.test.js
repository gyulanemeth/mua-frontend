import { createApp } from 'vue'
import { test, beforeEach, expect, describe } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import useCaptchaStore from './captcha.js'

describe('captcha Store', () => {
  const app = createApp({})

  const mokeConnector = () => {
    const mockGetCaptcha = async function () {
      return { text: 'test' }
    }

    return {
      getCaptcha: mockGetCaptcha
    }
  }

  beforeEach(() => {
    const pinia = createPinia().use(useCaptchaStore)
    app.use(pinia)
    setActivePinia(createPinia())
  })

  test('test get captcha', async () => {
    const captchaStore = useCaptchaStore(mokeConnector())
    const captcha = captchaStore()
    const res = await captcha.getCaptcha()
    expect(res).toEqual({ text: 'test' })
  })
})
