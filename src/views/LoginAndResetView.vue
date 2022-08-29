<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute } from 'vue-router'
import jwtDecode from 'jwt-decode'

import LoginAndResetForm from '../components/LoginAndResetForm.vue'

import { useCurrentUserAndAccountStore } from '../stores/index.js'

const store = useCurrentUserAndAccountStore()
const route = useRoute()

const tokenData = ref({})
const formData = ref()

async function loadData () {
  if (route.name === 'login') {
    formData.value = { btnText: 'Sign in', header: 'Sign in to your account' }
  }
  if (route.query.token) {
    tokenData.value = jwtDecode(route.query.token)
    if (route.name === 'login-select') {
      formData.value = { btnText: 'Sign in', header: 'Sign in to your account' }
    }
    if (route.name === 'forgot-password' || route.name === 'forgot-password-reset') {
      formData.value = { btnText: 'Reset Password', header: 'Password recovery' }
    }
  }
}

async function handleForgotPasswordResetEvent (params) {
  await store.resetForgotPassword(route.query.token, params.password, params.confirmPassword)
}

async function handleForgotPasswordEvent (params, statusCallBack) {
  const res = await store.sendForgotPassword({ email: params.email, accountId: params.account })
  if (!res.message) {
    statusCallBack(true)
  }
}

async function handleGetLoginAccountEvent (params, statusCallBack) {
  const res = await store.loginGetAccounts(params)
  if (!res.message) {
    statusCallBack(true)
  }
}

async function handleLoginEvent (params) {
  await store.login(route.query.token, params.password, params.account)
}

watchEffect(async () => {
  loadData()
})

</script>

<template>
<LoginAndResetForm v-if="formData" :formData='formData' :tokenData="tokenData" @handleForgotPasswordResetHandler="handleForgotPasswordResetEvent" @handleForgotPasswordHandler="handleForgotPasswordEvent" @handleGetLoginAccountsHandler="handleGetLoginAccountEvent" @handleLoginHandler="handleLoginEvent" />
</template>
