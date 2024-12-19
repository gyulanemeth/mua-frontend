<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'

import LoginForm from '../components/UserLoginForm.vue'
import LoginWithUrlFriendlyNameForm from '../components/UserLoginWithUrlFriendlyNameForm.vue'
import ResetPasswordForm from '../components/UserResetPasswordForm.vue'

import { useAccountsStore, useUsersStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'

const accountsStore = useAccountsStore()
const usersStore = useUsersStore()
const route = useRoute()
const router = useRouter()

const tokenData = ref({})
const formData = ref()
const accountData = ref()

async function loadData () {
  if (route.name === 'accounts-login-with-urlFriendlyName') {
    accountData.value = await accountsStore.getAccountByUrlFriendlyName(route.params.urlFriendlyName)
    if (accountData.value.message) {
      return router.push('/accounts/')
    }
    formData.value = {
      _id: accountData.value._id,
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
        router.push('/accounts/')
      }
      if (route.name === 'accounts-create-password') {
        const res = await usersStore.createPassword({ token: route.query.token, id: tokenData.value.user._id, accountId: tokenData.value.account._id })
        if (res.success) {
          await accountsStore.readOne()
          await usersStore.readOne()
          useSystemMessagesStore().addSuccess({ message: 'Password added successfully' })
          return router.push(`/accounts/${accountsStore.account.urlFriendlyName}/me`)
        }
        return router.push('/accounts/')
      } else if (tokenData.value.account) {
        tokenData.value.accounts = [tokenData.value.account]
      }
    }
    if (route.name === 'accounts-forgot-password' || route.name === 'accounts-forgot-password-reset') {
      formData.value = false
      if (route.query.token) {
        formData.value = { email: tokenData.value.user.email, account: route.query.account ? tokenData.value.accounts.find(ele => ele._id === route.query.account) : tokenData.value.account }
      } else if (route.query.urlFriendlyName) {
        accountData.value = await accountsStore.getAccountByUrlFriendlyName(route.query.urlFriendlyName)
        if (accountData.value.message) {
          return router.push('/accounts/')
        }
        formData.value = { account: accountData.value }
      } else {
        useSystemMessagesStore().addError({
          status: 400,
          name: 'VALIDATION_ERROR',
          message: 'urlFriendlyName not found'
        })
        return router.push('/accounts/')
      }
    }
  }
}

async function handleForgotPasswordResetEvent (params, statusCallBack) {
  await usersStore.resetForgotPassword(route.query.token, params.password, params.confirmPassword)
  statusCallBack()
}

async function handleForgotPasswordEvent (params, statusCallBack) {
  const res = await usersStore.sendForgotPassword({
    email: params.email,
    accountId: params.account._id
  })
  statusCallBack(!res.message && 'reset')
}

async function handleGetLoginAccountEvent (params, statusCallBack) {
  const res = await usersStore.loginGetAccounts(params)
  statusCallBack(!res.message)
}

async function handleLoginWithUrlFriendlyNameEvent (params, statusCallBack) {
  const res = await usersStore.loginWithUrlFriendlyName({ ...params, urlFriendlyName: route.params.urlFriendlyName })
  statusCallBack(res.success)
  if (res.success) {
    await accountsStore.readOne(route.params.urlFriendlyName)
    router.push(`/accounts/${route.params.urlFriendlyName}/dashboard`)
  }
}

async function handleLoginEvent (params, statusCallBack) {
  const res = await usersStore.login(route.query.token, params.password, params.account)
  statusCallBack(res.success)
  if (res.success) {
    await accountsStore.readOne(route.params.urlFriendlyName)
    router.push('accounts/')
  }
}

watchEffect(async () => {
  loadData()
})

</script>

<template>

  <ResetPasswordForm
    v-if="formData && (route.name === 'accounts-forgot-password' || route.name === 'accounts-forgot-password-reset')"
    :formData='formData' @handleForgotPasswordResetHandler="handleForgotPasswordResetEvent"
    @handleForgotPasswordHandler="handleForgotPasswordEvent" />

  <LoginWithUrlFriendlyNameForm v-else-if="formData && route.name === 'accounts-login-with-urlFriendlyName'"
    :formData='formData' @handleLoginWithUrlFriendlyName="handleLoginWithUrlFriendlyNameEvent" />

  <LoginForm v-else-if="route.name === 'accounts-login' || route.name === 'accounts-login-select'"
    :tokenData="tokenData" @handleGetLoginAccountsHandler="handleGetLoginAccountEvent"
    @handleLoginHandler="handleLoginEvent" />

</template>
