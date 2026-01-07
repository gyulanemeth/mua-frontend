<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useAccountsStore } from '../stores/index.js'

const accountsStore = useAccountsStore()
const route = useRoute()

const urlFriendlyName = ref()

const title = import.meta.env.VITE_APP_TITLE
const appIcon = import.meta.env.VITE_APP_LOGO_URL
const domain = window.location.origin
onMounted(async () => {
  await accountsStore.readOne()
  urlFriendlyName.value = accountsStore.account.urlFriendlyName
})

</script>

<template>
  <v-layout style="z-index: 10;" class="d-flex flex-wrap w-100 h-screen align-center justify-center">
    <div class="w-100 ma-auto d-flex flex-wrap align-center justify-center">
      <v-card elevation="0" class="w-100 loggedOutState">
        <v-card-text align="center">
          <a style="text-decoration: none; color: black;" :href="`${domain}`">
            <v-avatar size="100">
              <v-img :src="appIcon" cover></v-img>
            </v-avatar>
          </a>
        </v-card-text>
        <v-card-text align="center" class="justify-center py-0">
          <p class="text-h4 text-center"> {{ title }} </p>
        </v-card-text>
      </v-card>
      <v-card class="pa-5 ma-5 elevation-4" width="800px">
        <v-card-text class="text-center">
          <v-icon icon="mdi-magnify-remove-outline" color="primary" size="90"></v-icon>
        </v-card-text>
        <v-card-text class="text-center">
          <p class="text-primary text-h5 font-weight-black d-inline">{{ $t('mua.notFoundView.title', { name: route.params.catchAll }) }}</p>
        </v-card-text>
        <v-card-text class="text-center">
          {{ $t('mua.notFoundView.header', {
            name: route.params.catchAll || 'page', id: route.query.id ? 'with _id: ' +
              route.query.id : ''}) }}
        </v-card-text>
        <v-card-text class="text-center">
          {{ $t('mua.notFoundView.bodyPart1') }} <a style="text-decoration: none; color: black;"
            :href="`${domain}`"><b> {{ $t('mua.notFoundView.redirectBtn') }} </b></a> {{
              $t('mua.notFoundView.bodyPart2') }}
        </v-card-text>
      </v-card>
    </div>
  </v-layout>
</template>
