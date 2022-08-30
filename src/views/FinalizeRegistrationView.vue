<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute } from 'vue-router'
import jwtDecode from 'jwt-decode'

import AcceptInvitationForm from '../components/AcceptInvitationForm.vue'

import { useCurrentUserAndAccountStore } from '../stores/index.js'
import alerts from '../alerts/alert.js'

const store = useCurrentUserAndAccountStore()
const route = useRoute()
const alert = alerts()

const data = ref()
const formData = ref()

async function loadData() {
  if (route.name === 'accept-invitation' && route.query.token) {
    data.value = jwtDecode(route.query.token)
    formData.value = {
      btnText: 'Create Account',
      header: 'Set up your account'
    }
  }
  if (route.name === 'finalize-registration' && route.query.token) {
    const res = await store.finalizeRegistration(route.query.token)
    if (res.success) {
      await alert.message('Your registration has been finalized')
    }
  }
}

async function handleAcceptInvitationEvent(params) {
  await new Promise(resolve => setTimeout(resolve, 5000))
  await store.acceptInvitation(route.query.token, params.newPassword, params.newPasswordAgain, params.name)
}

watchEffect(async() => {
  loadData()
})

</script>


<template>

<AcceptInvitationForm v-if="formData" :formData="formData" @handleAcceptInvitationHandler="handleAcceptInvitationEvent" />

</template>
