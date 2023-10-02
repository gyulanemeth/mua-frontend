<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'

import LoginForm from '../components/LoginForm.vue'
import LoginWithUrlFriendlyNameForm from '../components/LoginWithUrlFriendlyNameForm.vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'

import { useCurrentUserAndAccountStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'

const store = useCurrentUserAndAccountStore()
const route = useRoute()
const router = useRouter()

const tokenData = ref({})
const formData = ref()
const accountData = ref()

async function loadData () {
  if (route.name === 'loginWithUrlFriendlyName') {
    accountData.value = await store.getAccountByUrlFriendlyName(route.params.urlFriendlyName)

    if (accountData.value.message) {
      return router.push('/')
    }
    formData.value = {
      accountName: accountData.value.name,
      urlFriendlyName: accountData.value.urlFriendlyName
    }
  }
  if (route.query) {
    if (route.query.token) {
      try {
        tokenData.value = jwtDecode(route.query.token)
      } catch (error) {
        useSystemMessagesStore().addError({
          status: 400,
          name: 'VALIDATION_ERROR',
          message: 'Invalid token'
        })
        router.push('/')
      }
      if (tokenData.value.account) {
        tokenData.value.accounts = [tokenData.value.account]
      }
    }
    if (route.name === 'forgot-password' || route.name === 'forgot-password-reset') {
      formData.value = false
      if (route.query.token) {
        formData.value = { email: tokenData.value.user.email, account: route.query.account ? tokenData.value.accounts.find(ele => ele._id === route.query.account) : tokenData.value.account }
      } else if (route.query.urlFriendlyName) {
        accountData.value = await store.getAccountByUrlFriendlyName(route.query.urlFriendlyName)
        if (accountData.value.message) {
          return router.push('/')
        }
        formData.value = { account: accountData.value }
      } else {
        useSystemMessagesStore().addError({
          status: 400,
          name: 'VALIDATION_ERROR',
          message: 'urlFriendlyName not found'
        })
        return router.push('/')
      }
    }
  }
}

async function handleForgotPasswordResetEvent (params, statusCallBack) {
  await store.resetForgotPassword(route.query.token, params.password, params.confirmPassword)
  statusCallBack()
}

async function handleForgotPasswordEvent (params, statusCallBack) {
  const res = await store.sendForgotPassword({
    email: params.email,
    accountId: params.account._id
  })
  statusCallBack(!res.message && 'reset')
}

async function handleGetLoginAccountEvent (params, statusCallBack) {
  const res = await store.loginGetAccounts(params)
  statusCallBack(!res.message)
}

async function handleLoginWithUrlFriendlyNameEvent (params, statusCallBack) {
  const res = await store.loginWithUrlFriendlyName({ ...params, urlFriendlyName: route.params.urlFriendlyName })
  statusCallBack(res)
}

async function handleLoginEvent (params, statusCallBack) {
  await store.login(route.query.token, params.password, params.account)
  statusCallBack(true)
}

watchEffect(async () => {
  loadData()
})

</script>

<template>

  <ResetPasswordForm v-if="formData && (route.name === 'forgot-password' || route.name === 'forgot-password-reset')"
    :formData='formData' @handleForgotPasswordResetHandler="handleForgotPasswordResetEvent"
    @handleForgotPasswordHandler="handleForgotPasswordEvent" />

    <LoginWithUrlFriendlyNameForm v-else-if="formData && route.name === 'loginWithUrlFriendlyName'" :formData='formData'
    @handleLoginWithUrlFriendlyName="handleLoginWithUrlFriendlyNameEvent" />

    <LoginForm v-else-if="route.name === 'login'" :tokenData="tokenData" @handleGetLoginAccountsHandler="handleGetLoginAccountEvent" @handleLoginHandler="handleLoginEvent" />

</template>
