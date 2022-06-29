<script setup>
import { defineComponent, watchEffect, ref } from 'vue'
import EmailAndNameForm from '../components/EmailAndNameForm.vue'
import stores from '../stores/index.js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const formData = ref()
const store = stores().currentUserAndAccountStore()
async function loadData () {
  if (route.name === 'invite') {
    formData.value = { inputType: 'Email', inputText: 'Email', text: 'Invite' }
  } else if (route.name === 'forgot-password') {
    formData.value = { inputType: 'Email', inputText: 'Email', text: 'Reset Password' }
  }
}

async function eventHandler (data) {
  let res
  if (formData.value.text === 'Invite') {
    res = await store.sendInvitation(data)
  } else if (formData.value.text === 'Reset Password') {
    res = await store.sendForgotPassword(data)
  }
  if (res === 'success') {
    router.push('/')
  }
}

watchEffect(async () => {
  loadData()
})
</script>

<template>
  <EmailAndNameForm :formData="formData" @buttonEvent="eventHandler" />
</template>
