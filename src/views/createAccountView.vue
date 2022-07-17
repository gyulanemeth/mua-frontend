<script setup>
import { useRouter, useRoute } from 'vue-router'

import CreateAccount from '../components/CreateAccount.vue'
import stores from '../stores/index.js'

const store = stores().currentUserAndAccountStore()

const router = useRouter()
const route = useRoute()

async function eventHandler (data) {
  let res

  if (route.name === 'createAccount') {
    res = await store.createAccount(data)
  } else if (route.name === 'adminCreateAccount') {
    res = await store.AdminCreateAccount(data.account)
  }

  if (res === 'success') {
    router.push('/')
  }
}

</script>

<template>
  <CreateAccount @buttonEvent="eventHandler" />
</template>
