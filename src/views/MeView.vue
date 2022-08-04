<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MeDetails from '../components/MeDetails.vue'
import UpdatePassword from '../components/UpdatePassword.vue'
import EmailAndNameForm from '../components/EmailAndNameForm.vue'
import stores from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'
import alerts from '../alerts/alert.js'

const store = stores().currentUserAndAccountStore()
const route = useRoute()
const router = useRouter()
const alert = alerts()

const formData = ref()

async function loadData () {
  if (route.name === 'verify-email') {
    const res = await store.patchEmailConfirm(route.query.token)
    if (res.success) {
      await alert.message('Email changed successfully')
    }
  }
  if (route.name === 'me') {
    if (!store.user.name) {
      await store.readOneUser()
    }
    formData.value = store.user
  }
  if (route.name === 'patch-user-name') {
    formData.value = { inputType: 'text', inputText: 'New Name', text: 'Update Name' }
  } else {
    if (store.user === null) {
      useSystemMessagesStore().addError({ status: 404, name: 'NOT_FOUND', message: 'User data not found please login' })
      return router.push('/')
    }
  }
}

async function eventHandler (data) {
  if (formData.value.text === 'Update Name') {
    await store.patchUserName(data)
  }
}
watchEffect(async () => {
  loadData()
})
</script>

<template>
  <EmailAndNameForm v-if="route.name === 'patch-user-name'" :formData="formData" @buttonEvent="eventHandler" />
  <UpdatePassword v-else-if="route.name === 'patch-password'"  />
  <MeDetails v-else-if="formData" :data="formData" />
</template>
