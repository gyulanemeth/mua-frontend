<script setup>
import { useAdminsStore } from '../stores/index.js'
import ForgotPasswordForm from '../components/AdminForgotPasswordForm.vue'

const store = useAdminsStore()

async function handlePasswordRecoveryEvent (data, statusCallBack) {
  const res = await store.sendForgotPassword(data)
  statusCallBack(!res.message)
}

</script>

<template>

  <ForgotPasswordForm  @passwordRecoveryEventHandler="handlePasswordRecoveryEvent" />

</template>
