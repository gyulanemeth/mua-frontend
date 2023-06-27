<script setup>
import CreateAccount from '../components/CreateAccount.vue'
import { useCurrentUserAndAccountStore } from '../stores/index.js'

const store = useCurrentUserAndAccountStore()

async function eventHandler (data, statusCallBack) {
  const res = await store.createAccount(data)
  statusCallBack(res.success)
}

</script>

<template>

<CreateAccount @buttonEvent="eventHandler" />

</template>
