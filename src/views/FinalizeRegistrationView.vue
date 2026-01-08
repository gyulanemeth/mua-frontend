<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'
import { useI18n } from 'vue-i18n'

import AcceptInvitationForm from '../components/AcceptInvitationForm.vue'

import { useUsersStore, useAccountsStore } from '../stores/index.js'

const { tm } = useI18n()
const store = useUsersStore()
const accountsStore = useAccountsStore()
const route = useRoute()
const router = useRouter()
const finalizeRegistrationRes = ref({})
const finalizeAccountRegistrationRes = ref({})
const data = ref()
const formData = ref()
const loading = ref()

const appIcon = import.meta.env.VITE_APP_LOGO_URL
if (!route.query.token) {
  router.push('./accounts/login')
}
async function loadData () {
  if (route.name === 'accounts-accept-invitation' && route.query.token) {
    data.value = jwtDecode(route.query.token)
    formData.value = {
      btnText: tm('mua.acceptInvitationForm.btnText'),
      header: tm('mua.acceptInvitationForm.header')
    }
  }
  if (route.name === 'accounts-finalize-registration' && route.query.token) {
    const tokenData = jwtDecode(route.query.token)
    loading.value = true
    if (tokenData.type === 'login') {
      localStorage.setItem('loginToken', route.query.token)
      finalizeAccountRegistrationRes.value = await store.getAccessToken(route.query.token)
    } else {
      finalizeRegistrationRes.value = await store.finalizeRegistration(route.query.token)
    }
    if (finalizeRegistrationRes.value.success || finalizeAccountRegistrationRes.value.success) {
      await accountsStore.readOne()
    }
    loading.value = false
  }
}

async function handleAcceptInvitationEvent (params, statusCallBack) {
  await new Promise(resolve => setTimeout(resolve, 5000))
  await store.acceptInvitation(route.query.token, params.newPassword, params.newPasswordAgain, params.name)
  statusCallBack()
}

watchEffect(async () => {
  loadData()
})

</script>

<template>

  <AcceptInvitationForm v-if="formData" :formData="formData"
    @handleAcceptInvitationHandler="handleAcceptInvitationEvent" />
  <div v-else class="d-flex flex-column justify-center align-center h-100">
    <v-card elevation="0">
      <v-card-text align="center" class="loggedOutState">
        <v-avatar size="80">
          <v-img :src="appIcon" cover></v-img>
        </v-avatar>
      </v-card-text>
    </v-card>
    <v-card class="rounded-xl elevation-2 d-flex flex-column justify-center align-right" width="80%" max-width="600">
      <v-layout style="z-index: 10;" v-if="loading" class="ma-auto d-flex flex-wrap pa-4 h-75">
        <v-card class="ma-auto align-self-start elevation-0 text-center" min-width="400">
          <v-progress-circular color="primary" indeterminate :size="90"></v-progress-circular>
          <p class="mt-3 text-body-2 font-weight-bold">{{ $t('loading') }}</p>
        </v-card>
      </v-layout>
      <CustomVerifyEmailMsg v-else-if="accountsStore.account && finalizeRegistrationRes.success" />
      <CustomAccountFinalizedMsg v-else-if="accountsStore.account && finalizeAccountRegistrationRes.success" />
      <v-card-text v-else align="left">
        <p class="text-h6 text-center text-red">{{ finalizeRegistrationRes?.name }}</p>
        <p class="mt-3 pa-2 text-center">{{ finalizeRegistrationRes?.message }}</p>
      </v-card-text>
    </v-card>
    <CustomFinalizeRegistrationLinks />
  </div>
</template>
