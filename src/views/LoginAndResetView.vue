<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'

import LoginForm from '../components/LoginForm.vue'
import LoginWithUrlFriendlyNameForm from '../components/LoginWithUrlFriendlyNameForm.vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'

import { useCurrentUserAndAccountStore } from '../stores/index.js'

const store = useCurrentUserAndAccountStore()
const route = useRoute()
const router = useRouter()

const tokenData = ref({})
const formData = ref()
const accountData = ref()

async function loadData () {
  if (route.name === 'loginWithUrlFriendlyName') {
    accountData.value = await store.getAccountByUrlFriendlyName(route.params.urlFriendlyName)
    if (!accountData.value.count) {
      return router.push('/404Page')
    }
    formData.value = {
      accountName: accountData.value.items[0].name,
      urlFriendlyName: accountData.value.items[0].urlFriendlyName
    }
  }
  if (route.query) {
    if (route.query.token) {
      tokenData.value = jwtDecode(route.query.token)
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
        if (!accountData.value.count) {
          return router.push('/404Page')
        }
        formData.value = { account: accountData.value.items[0] }
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
  statusCallBack(!res.message)
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

    <LoginForm v-else :tokenData="tokenData" @handleGetLoginAccountsHandler="handleGetLoginAccountEvent" @handleLoginHandler="handleLoginEvent" />

</template>
