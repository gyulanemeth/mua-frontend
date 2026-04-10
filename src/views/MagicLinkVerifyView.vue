<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'
import { useUsersStore, useAccountsStore } from '../stores/index.js'
import MFALoginForm from '../components/MFALoginForm.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const accountsStore = useAccountsStore()

const state = ref('verifying') // verifying | error | twoFactor
const errorMessage = ref('')

onMounted(async () => {
  const token = route.query.token
  if (!token) {
    state.value = 'error'
    errorMessage.value = 'Missing token'
    return
  }
  try {
    jwtDecode(token)
  } catch {
    state.value = 'error'
    errorMessage.value = 'Invalid token'
    return
  }

  const res = await usersStore.verifyMagicLink(token)
  if (res.twoFactorEnabled) {
    state.value = 'twoFactor'
    return
  }
  if (res.success) {
    await accountsStore.readOne()
    router.push(`/accounts/${accountsStore.account.urlFriendlyName}/dashboard`)
    return
  }
  state.value = 'error'
  errorMessage.value = res.message || 'Verification failed'
})
</script>

<template>
  <v-layout class="d-flex flex-column justify-center align-center h-100">
    <MFALoginForm v-if="state === 'twoFactor'" />

    <v-card v-else class="ma-2 pa-6 rounded-xl elevation-2 text-center" width="80%" max-width="480px">
      <div v-if="state === 'verifying'">
        <v-progress-circular indeterminate color="primary" size="48" class="mb-4" />
        <p class="text-h6">{{ $t('mua.magicLinkVerify.verifyingHeader') }}</p>
        <p class="text-body-2 text-medium-emphasis mt-2">{{ $t('mua.magicLinkVerify.verifyingMessage') }}</p>
      </div>

      <div v-else-if="state === 'error'">
        <v-icon size="48" color="error" class="mb-3">mdi-alert-circle-outline</v-icon>
        <p class="text-h6 mb-2">{{ $t('mua.magicLinkVerify.errorHeader') }}</p>
        <p class="text-body-2 text-medium-emphasis mb-4">{{ $t('mua.magicLinkVerify.errorMessage') }}</p>
        <v-btn color="primary" @click="$router.push('/accounts/login')">
          {{ $t('mua.magicLinkVerify.backToLoginBtn') }}
        </v-btn>
      </div>
    </v-card>
  </v-layout>
</template>
