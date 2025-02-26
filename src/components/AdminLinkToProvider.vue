<script setup>
import { ref } from 'vue'
import { useAdminsStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'
import ConfirmDisconnectProviderDialog from './ConfirmDisconnectProviderDialog.vue'

const props = defineProps({
  userId: String
})

const userData = ref(useAdminsStore().user)
const confirmDialogRef = ref()

const googleProvider = import.meta.env.VITE_AUTH_PROVIDERS?.includes('google')

async function submitLinkToProvider () {
  const res = await useAdminsStore().linkToProvider({ id: props.userId })
  if (res.redirectUrl) {
    const popup = window.open(res.redirectUrl, 'provider-link-popup', 'width=600,height=600')
    if (popup) {
      const interval = setInterval(async () => {
        try {
          const params = new URLSearchParams(popup.location.search)
          const successQuery = params.get('success')
          const failedQuery = params.get('failed')
          if (!popup.closed && (successQuery || failedQuery)) {
            clearInterval(interval)
            popup.close()
            if (successQuery) {
              useSystemMessagesStore().addSuccess({ name: 'Linked Successfully' })
              userData.value.googleProfileId = true
            } else if (failedQuery) {
              useSystemMessagesStore().addError({ name: 'Authentication failed' })
            }
          }
        } catch (e) {
          console.error('Error accessing popup URL parameters:', e)
        }
      }, 500)
    }
  }
}

async function disconnect ({ password }) {
  const res = await useAdminsStore().disconnectProvider({ id: props.userId, password })
  if (!res.message) {
    userData.value = res
    useSystemMessagesStore().addSuccess({ name: 'Disconnected Successfully' })
  }
}

</script>

<template>
  <div class="mb-5" v-if="googleProvider">
    <ConfirmDisconnectProviderDialog ref="confirmDialogRef" @okButtonPressed="(params) => disconnect(params)" />
    <p class="text-body-1 font-weight-bold ">{{ $t('mua.linkToProvider.header') }}</p>
    <v-divider />
    <v-row class="my-2">
      <v-col v-if="googleProvider" cols="auto" class="text-center justify-center align-center">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="80px" height="80px">
            <path fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
        </div>
        <p v-if="userData.googleProfileId" class="mx-2 mb-2 text-caption font-weight-medium">{{
          $t('mua.linkToProvider.connectedLabel') }} <br> {{ userData.email }} </p>
        <p v-if="!userData.googleProfileId" class="mx-2 mb-2 text-caption font-weight-medium">{{
          $t('mua.linkToProvider.connectToLabel') }} <br> {{ $t('mua.linkToProvider.googleLabel') }}</p>
        <v-btn v-if="!userData.googleProfileId" @click="submitLinkToProvider('google')" class="pa-2 border"
          variant="text">
          <span class="mx-2 text-caption font-weight-medium">{{ $t('mua.linkToProvider.connectBtn') }}</span>
        </v-btn>
        <v-btn v-if="userData.googleProfileId"
          @click="confirmDialogRef.show({ provider: 'google', name: $t('mua.linkToProvider.googleLabel') })"
          class="pa-2 border" variant="text">
          <span class="mx-2 text-caption font-weight-medium">{{ $t('mua.linkToProvider.disconnectBtn') }}</span>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
