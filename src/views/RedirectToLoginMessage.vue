<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'

const countDown = ref(5)
const router = useRouter()
const decoded = jwtDecode(localStorage.getItem('accessToken'))
const loginPageUrl = decoded.type === 'admin' ? '/system-admins/login' : '/accounts/login'

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
  <v-layout style="z-index: 10;" class="d-flex flex-wrap w-100 align-center justify-center">
    <v-card class="pa-5 ma-5 elevation-4" width="80%" max-width="800px">
      <v-card-text class="text-center">
        <v-icon icon="mdi-alert-circle-outline" color="primary" size="60"></v-icon>
      </v-card-text>
      <v-card-text class="text-center">
        <v-alert class="w-100" color="primary" prominent>
          {{ $t('mua.redirectToLoginMessage.title') }}
        </v-alert>

      </v-card-text>
      <v-card-text class="text-center">
        {{ $t('mua.redirectToLoginMessage.autoRedirectMessage') }} {{ countDown }} {{
          $t('mua.redirectToLoginMessage.bodyPart1')
        }}<br /> {{ $t('mua.redirectToLoginMessage.bodyPart2') }} <a
          style="text-decoration: none; cursor: pointer; color: black;" @click="redirect"><b> {{
            $t('mua.redirectToLoginMessage.redirectBtn') }} </b></a> {{
              $t('mua.redirectToLoginMessage.bodyPart3') }}

      </v-card-text>
    </v-card>
  </v-layout>
</template>
