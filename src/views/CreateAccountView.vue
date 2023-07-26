<script setup>
import CreateAccount from '../components/CreateAccount.vue'
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import alerts from '../alerts/alert.js'

const store = useCurrentUserAndAccountStore()
const alert = alerts()

async function createEventHandler (data, statusCallBack) {
  const res = await store.createAccount(data)
  if (res.success) {
    statusCallBack(res)
    alert.message('Email sent successfully')
  }
}

async function reSendFinalizeRegistrationEventHandler (params) {
  const res = await store.reSendFinalizeRegistration(params)
  if (res.success) {
    alert.message('Email sent successfully')
  }
}

</script>

<template>

<CreateAccount @buttonEvent="createEventHandler" @reSendFinalizeRegistrationEvent=" reSendFinalizeRegistrationEventHandler" />

</template>
