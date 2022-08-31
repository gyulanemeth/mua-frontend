<script setup>
import CreateAccount from '../components/CreateAccount.vue'
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import alerts from '../alerts/alert.js'

const store = useCurrentUserAndAccountStore()
const alert = alerts()

async function eventHandler (data) {
  const res = await store.createAccount(data)
  if (res.success) {
    await alert.message('message Send to your email')
  }
}

</script>

<template>

<CreateAccount @buttonEvent="eventHandler" />

</template>
