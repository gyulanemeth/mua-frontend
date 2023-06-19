<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute } from 'vue-router'
import jwtDecode from 'jwt-decode'
import { useI18n } from 'vue-i18n'

import LoginAndResetForm from '../components/LoginAndResetForm.vue'

import { useCurrentUserAndAccountStore } from '../stores/index.js'

const { tm } = useI18n()
const store = useCurrentUserAndAccountStore()
const route = useRoute()

const tokenData = ref({})
const formData = ref()

async function loadData () {
  if (route.name === 'login') {
    formData.value = {
      btnText: tm('loginAndResetForm.loginBtnText'),
      header: tm('loginAndResetForm.loginHeader')
    }
  }
  if (route.name === 'loginWithUrlFriendlyName') {
    formData.value = {
      btnText: tm('loginAndResetForm.loginBtnText'),
      header: tm('loginAndResetForm.loginHeader'),
      urlFriendlyName: true
    }
  }
  if (route.query.token) {
    tokenData.value = jwtDecode(route.query.token)
    if (tokenData.value.account) {
      tokenData.value.accounts = [tokenData.value.account]
    }
    if (route.name === 'login-select') {
      formData.value = {
        btnText: tm('loginAndResetForm.loginBtnText'),
        header: tm('loginAndResetForm.loginHeader')
      }
    }
    if (route.name === 'forgot-password' || route.name === 'forgot-password-reset') {
      formData.value = {
        btnText: tm('loginAndResetForm.resetBtnText'),
        header: tm('loginAndResetForm.resetHeader')
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
    accountId: params.account
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

<LoginAndResetForm v-if="formData" :formData='formData' :tokenData="tokenData" @handleLoginWithUrlFriendlyName="handleLoginWithUrlFriendlyNameEvent" @handleForgotPasswordResetHandler="handleForgotPasswordResetEvent" @handleForgotPasswordHandler="handleForgotPasswordEvent" @handleGetLoginAccountsHandler="handleGetLoginAccountEvent" @handleLoginHandler="handleLoginEvent" />

</template>
