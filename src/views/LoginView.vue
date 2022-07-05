<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'

import EmailAndNameForm from '../components/EmailAndNameForm.vue'
import LoginSelectAccount from '../components/LoginSelectAccount.vue'
import stores from '../stores/index.js'

const store = stores().currentUserAndAccountStore()
const route = useRoute()
const router = useRouter()

const data = ref()
const formData = ref()

async function loadData () {
  if (route.query.token) {
    data.value = jwtDecode(route.query.token)
  } else {
    formData.value = { inputType: 'email', inputText: 'Login Email', text: 'Login Email' }
  }
}

async function eventHandler (data) {
  let res
  if (formData.value.text === 'Login Email') {
    res = await store.loginGetAccounts(data)
  }
  if (res === 'success') {
    router.push('/me')
  }
}

watchEffect(async () => {
  loadData()
})
</script>

<template>
  <EmailAndNameForm v-if="route.name === 'login'" :formData="formData" @buttonEvent="eventHandler" />

  <template v-else>
  <LoginSelectAccount v-if="data" :token="route.query.token" :data="data.accounts" />
  <v-row v-else class="text-center" justify="center">
    <v-progress-circular
    indeterminate
    :size="70"
    :width="7"
    color="red"
  ></v-progress-circular>
</v-row>
  </template>
</template>
