<script setup>
import { ref } from 'vue'
import { useUsersStore, useAdminsStore, useAccountsStore } from '../stores/index.js'
import { useRouter } from 'vue-router'

const props = defineProps({
  systemAdmin: Boolean
})

const userStore = props.systemAdmin ? useAdminsStore() : useUsersStore()

const router = useRouter()

const processing = ref()
const code = ref()
const recoveryMode = ref()

async function submit () {
  processing.value = true
  const data = {}
  if (recoveryMode.value) {
    data.recoveryCode = code.value
  } else {
    data.code = code.value
  }
  const res = await userStore.MFALogin(data)
  processing.value = false
  if (!props.systemAdmin && res.success) {
    const accountStore = useAccountsStore()
    await accountStore.readOne()
    router.push(`/accounts/${accountStore.account.urlFriendlyName}/dashboard`)
  }
}

const appIcon = import.meta.env.VITE_APP_LOGO_URL
</script>

<template>
    <v-layout style="z-index: 10;" class="d-flex flex-column justify-center align-center h-100">
        <v-card elevation="0">
            <v-card-text align="center" class="loggedOutState">
                <v-avatar size="80">
                    <v-img :src="appIcon" cover></v-img>
                </v-avatar>
            </v-card-text>
        </v-card>
        <v-card class="ma-2 pa-2 rounded-xl elevation-2" width="80%" max-width="600px" @keydown.enter="submit">
            <v-card-text align="center">
                <v-icon size="40" color="primary" class="mb-3">mdi-shield-lock-outline</v-icon>
                <p class="text-h6 mb-1">{{ $t(`mua.mfaLoginForm.${recoveryMode ? 'recoveryMode' : 'codeMode'}.title`) }}</p>
                <p class="text-body-2 text-medium-emphasis mb-5">{{ $t(`mua.mfaLoginForm.${recoveryMode ? 'recoveryMode' : 'codeMode'}.codeLable`) }}</p>

                <v-text-field hide-details v-model="code" density="compact" class="mb-4 rounded" color="primary"
                    variant="solo" :name="recoveryMode ? 'recoveryCode' : 'code'" required />

                <v-btn block color="primary" data-test-id="loginAndResetForm-getLoginAccountsBtn" @click="submit">
                    {{ !processing ? $t(`mua.mfaLoginForm.${recoveryMode ? 'recoveryMode' : 'codeMode'}.submitBtn`) : '' }}
                    <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                        processing ? $t('mua.processing') : '' }}
                </v-btn>
            </v-card-text>
        </v-card>
        <v-container class="w-100">
            <v-col class="text-center justify-center align-center">
                <p style="color: #888888;">
                    {{ $t(`mua.mfaLoginForm.${recoveryMode ? 'recoveryMode' : 'codeMode'}.${recoveryMode ? 'codeTitle' : 'recoveryTitle'}`) }}
                </p>
                <p style="color: #888888;">
                    {{ $t(`mua.mfaLoginForm.${recoveryMode ? 'recoveryMode' : 'codeMode'}.${recoveryMode ? 'codeSubtitle' : 'recoverySubtitle'}`) }}
                    <span class="text-primary font-weight-bold" style="cursor: pointer;"
                        @click="recoveryMode = !recoveryMode">
                        {{ $t(`mua.mfaLoginForm.${recoveryMode ? 'recoveryMode' : 'codeMode'}.${recoveryMode ? 'codeBtn' : 'recoveryBtn'}`) }}
                    </span>.
                </p>
            </v-col>
        </v-container>
    </v-layout>
</template>
