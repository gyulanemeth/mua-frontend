<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'
import { useAdminsStore, useUsersStore } from '../stores/index.js'

const countDown = ref(30)
const router = useRouter()
const decoded = jwtDecode(localStorage.getItem('accessToken'))
const loginPageUrl = decoded.type === 'admin' ? '/system-admins/login' : '/accounts/login'

async function renewToken () {
  if (decoded.type === 'admin') {
    await useAdminsStore().renewAccessToken()
    return router.push('/system-admins/')
  } else {
    await useUsersStore().renewAccessToken()
    return router.push('/accounts/')
  }
}

function redirect () {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('accountId')
  router.push(loginPageUrl)
}

function redirectCheck () {
  if (countDown.value === 0) {
    redirect()
  } else {
    countDown.value = countDown.value - 1
  }
};

const intervalId = setInterval(redirectCheck, 1000)

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

</script>

<template>
  <v-layout style="z-index: 10;" class="d-flex flex-wrap w-100 h-100 align-center justify-center">
    <v-card class="pa-5 ma-5 border rounded-xl" width="80%" max-width="700px">
      <v-card-text class="text-center">
        <v-icon icon="mdi-alert-circle-outline" color="primary" class="mb-2" size="60"></v-icon>
        <P class="text-h6">{{ $t('mua.redirectToLoginMessage.title') }}</P>
        <p class="mt-2">{{ $t('mua.redirectToLoginMessage.description') }}</p>
        <div class="d-flex flex-wrap w-100 align-center justify-center my-10">
          <v-btn class="elevation-0" @click="renewToken" color="primary">{{ $t('mua.redirectToLoginMessage.renewBtn') }}</v-btn>
          <v-btn color="grey-lighten-3" @click="redirect" class="mx-4 elevation-0">{{ $t('mua.redirectToLoginMessage.logoutBtn')
            }}</v-btn>
          <v-btn class="elevation-0" @click="redirect" color="grey-lighten-3">{{ $t('mua.redirectToLoginMessage.goToLoginBtn') }}</v-btn>
        </div>
        <p class="mt-7 mb-2">{{ $t('mua.redirectToLoginMessage.autoRedirectMessage', { seconds: countDown }) }}</p>
        <p>{{ $t('mua.redirectToLoginMessage.bodyPart2') }} <a
            style="text-decoration: none; cursor: pointer; color: black;" @click="redirect"><b> {{
              $t('mua.redirectToLoginMessage.redirectBtn') }} </b></a> {{ $t('mua.redirectToLoginMessage.bodyPart3') }}
        </p>
      </v-card-text>
    </v-card>
  </v-layout>
</template>
