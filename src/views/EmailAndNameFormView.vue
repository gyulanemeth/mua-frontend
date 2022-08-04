<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute } from 'vue-router'

import EmailAndNameForm from '../components/EmailAndNameForm.vue'
import stores from '../stores/index.js'
import alerts from '../alerts/alert.js'

const store = stores().currentUserAndAccountStore()
const route = useRoute()
const alert = alerts()

const formData = ref()

async function loadData () {
  if (route.name === 'invite') {
    formData.value = { inputType: 'Email', inputText: 'Email', text: 'Invite' }
  } else if (route.name === 'patch-email') {
    formData.value = { inputType: 'Email', inputText: 'Email', text: 'Update Email' }
  } else if (route.name === 'forgot-password') {
    formData.value = { inputType: 'Email', inputText: 'Email', text: 'Reset Password' }
  }
}

async function eventHandler (data) {
  let res
  if (formData.value.text === 'Invite') {
    res = await store.sendInvitation(data)
    if (res.success) {
      await alert.message('message Send to your email')
    }
  } else if (formData.value.text === 'Reset Password') {
    res = await store.sendForgotPassword({ email: data, accountId: route.query.accountId })
    if (res.success) {
      await alert.message('message Send to your email')
    }
  } else if (formData.value.text === 'Update Email') {
    res = await store.patchEmail(data)
    if (res.success) {
      await alert.message('Message sent to your email')
    }
  }
}

watchEffect(async () => {
  loadData()
})
</script>

<template>
  <EmailAndNameForm v-if="formData" :formData="formData" @buttonEvent="eventHandler" />
</template>
