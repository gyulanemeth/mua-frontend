<script setup>

import { watchEffect, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import SetAndReSetPassword from '../components/AdminSetAndReSetPassword.vue'
import MFALoginForm from '../components/MFALoginForm.vue'
import useSystemMessagesStore from '../stores/systemMessages.js'
import { useAdminsStore } from '../stores/index.js'

const store = useAdminsStore()
const route = useRoute()
const router = useRouter()
const { tm } = useI18n()

const formData = ref()
const twoFactorEnabled = ref(false)

async function loadData () {
  if (route.name === 'system-admins-accept-invitation') {
    formData.value = {
      text: tm('mua.adminSetAndReSetPassword.acceptHeader')
    }
  }
  if (route.name === 'system-admins-forgot-password-reset') {
    formData.value = {
      text: tm('mua.adminSetAndReSetPassword.forgotHeader')
    }
  }
}

async function handleSetPasswordEvent (params) {
  const res = await store.acceptInvitation(params.token, params.newPassword, params.newPasswordAgain, params.name)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('mua.adminSetAndReSetPassword.registeredAlert') })
  }
}

async function handleResetPassword (params, statusCallBack) {
  const res = await store.resetForgotPassword(params.token, params.newPassword, params.newPasswordAgain)
  if (res?.twoFactorEnabled) {
    statusCallBack(false)
    twoFactorEnabled.value = true
    return
  }
  statusCallBack(!res.message && res)
  if (!res.message) {
    await new Promise(resolve => setTimeout(resolve, 5000))
    router.push('/system-admins/me')
  }
}

watchEffect(async () => {
  loadData()
})

</script>

<template>

  <MFALoginForm v-if="twoFactorEnabled" systemAdmin />
  <SetAndReSetPassword v-else :formData="formData" @setPasswordEventHandler="handleSetPasswordEvent" @resetPasswordEventHandler="handleResetPassword" />

</template>
