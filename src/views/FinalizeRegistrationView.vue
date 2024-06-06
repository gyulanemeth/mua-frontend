<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute } from 'vue-router'
import jwtDecode from 'jwt-decode'
import { useI18n } from 'vue-i18n'

import AcceptInvitationForm from '../components/AcceptInvitationForm.vue'

import { useUsersStore, useAccountsStore } from '../stores/index.js'

const { tm } = useI18n()
const store = useUsersStore()
const accountsStore = useAccountsStore()
const route = useRoute()
const finalizeRegistrationRes = ref()
const data = ref()
const formData = ref()
const loading = ref()

const appIcon = window.config.appIcon

async function loadData () {
  if (route.name === 'system-accounts-accept-invitation' && route.query.token) {
    data.value = jwtDecode(route.query.token)
    formData.value = {
      btnText: tm('muaAuth.acceptInvitationForm.btnText'),
      header: tm('muaAuth.acceptInvitationForm.header')
    }
  }
  if (route.name === 'system-accounts-finalize-registration' && route.query.token) {
    loading.value = true
    finalizeRegistrationRes.value = await store.finalizeRegistration(route.query.token)
    if (finalizeRegistrationRes.value.success) {
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
  <div v-else class="d-flex flex-column justify-center align-center h-screen">

    <v-card class="rounded-xl elevation-2 d-flex flex-column justify-center align-right" width="40%">
      <v-card-text align="center">
        <v-avatar size="80">
          <v-img :src="appIcon" cover></v-img>
        </v-avatar>
      </v-card-text>
      <v-layout v-if="loading" class="ma-auto d-flex flex-wrap pa-4 h-75">
      <v-card class="ma-auto align-self-start elevation-0 text-center" min-width="400">
        <v-progress-circular color="info" indeterminate :size="90"></v-progress-circular>
        <h4 class="mt-3">{{ $t('loading') }}</h4>
      </v-card>
    </v-layout>
      <v-card-text v-else-if="accountsStore.account" align="left">
        <h4 class="text-h6 text-center text-green">{{ $t('muaAuth.finalizeRegistrationView.header') }}</h4>
        <p class="mt-3 pa-2">{{ $t('muaAuth.finalizeRegistrationView.message') }}</p>
        <p class="pa-2">{{ $t('muaAuth.finalizeRegistrationView.createFirstProjectLabel') }}
          <router-link style="text-decoration: none; color: inherit;" class="font-weight-bold"
            :to="`/accounts/${accountsStore.account.urlFriendlyName}/projects/create`">{{ $t('muaAuth.finalizeRegistrationView.createFirstProjectBtn') }}</router-link>
        </p>
        <p class="pa-2">{{ $t('muaAuth.finalizeRegistrationView.redirectToMainPageLabel') }}
          <router-link style="text-decoration: none; color: inherit;" class="font-weight-bold"
            :to="`/system-accounts/`">{{ $t('muaAuth.finalizeRegistrationView.redirectToMainPageBtn') }}</router-link>
        </p>
      </v-card-text>
      <v-card-text v-else align="left">
        <h4 class="text-h6 text-center text-red">{{ finalizeRegistrationRes.name }}</h4>
        <p class="mt-3 pa-2 text-center">{{ finalizeRegistrationRes.message }}</p>
      </v-card-text>
    </v-card>
  </div>
</template>
