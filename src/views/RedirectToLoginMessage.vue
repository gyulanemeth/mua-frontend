<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const countDown = ref(5)
const route = useRoute()
const url = ref('/system-accounts/' + (route.params.urlFriendlyName || ''))
function redirect () {
  if (countDown.value === 0) {
    window.location.href = url.value
  } else {
    countDown.value = countDown.value - 1
  }
};

setInterval(redirect, 1000)
</script>

<template>
  <v-layout class="d-flex flex-wrap w-100 align-center justify-center">
    <v-card class="pa-5 ma-5 elevation-4" width="80%" max-width="800px">
      <v-card-text class="text-center">
        <v-icon icon="mdi-alert-circle-outline" color="info" size="60"></v-icon>
      </v-card-text>
      <v-card-text class="text-center">
        <v-alert class="w-100" color="info" prominent>
          {{ $t('muaAuth.redirectToLoginMessage.title') }}
        </v-alert>

      </v-card-text>
      <v-card-text class="text-center">
        {{ $t('muaAuth.redirectToLoginMessage.autoRedirectMessage') }} {{ countDown }} {{ $t('muaAuth.redirectToLoginMessage.bodyPart1')
        }}<br /> {{ $t('muaAuth.redirectToLoginMessage.bodyPart2') }} <a style="text-decoration: none; color: black;"
          :href="url"><b> {{ $t('muaAuth.redirectToLoginMessage.redirectBtn') }} </b></a> {{
            $t('muaAuth.redirectToLoginMessage.bodyPart3') }}

      </v-card-text>
    </v-card>
  </v-layout>
</template>
