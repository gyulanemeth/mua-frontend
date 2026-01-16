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
        <div v-if="!recoveryMode" class="d-flex flex-column justify-center align-center w-100">
            <v-card class="ma-2 pa-2 rounded-xl elevation-2" width="80%" max-width="600px">
                <v-card-text align="center"
                    @keydown.enter="processing = true; $emit('handleLoginWithUrlFriendlyName', {}, () => { processing = false })">
                    <p class="text-h6">Two Factor Authentication</p>
                    <p class="text-body-1 text-start mt-5">Enter the verification code from your authenticator app</p>
                    <v-text-field hide-details v-model="code" density="compact" class="mb-5 rounded" color="primary"
                        variant="solo" name="code" :label="'code'" required />
                    <div>
                        <v-btn color="primary" data-test-id="loginAndResetForm-getLoginAccountsBtn" @click="submit">
                            {{ !processing ? $t('mua.userLoginAndResetForm.loginBtnText') : '' }}
                            <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                                processing ? $t('mua.processing') : '' }}
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
            <v-container class="w-100">
                <v-col class="text-center justify-center align-center">
                    <p style="color: #888888;">Can’t provide the code?</p>
                    <p style="text-decoration: none;  color: #888888">
                        Use your recovery code to sign <span class="text-primary font-weight-bold"
                            style="cursor: pointer;" @click="() => { recoveryMode = true }">Enter here</span>.
                    </p>
                </v-col>
            </v-container>
        </div>
        <div v-else class="d-flex flex-column justify-center align-center w-100">
            <v-card class="ma-2 pa-2 rounded-xl elevation-2" width="80%" max-width="600px">
                <v-card-text align="center" @keydown.enter="submit">
                    <p class="text-h6">2FA Recovery Code</p>
                    <p class="text-body-1 text-start mt-5">Enter your recovery code to sign in to your account.</p>
                    <v-text-field hide-details density="compact" v-model="code" class="mb-5 rounded" color="primary"
                        variant="solo" name="recoveryCode" :label="'recovery code'" required />
                    <div>
                        <v-btn color="primary" data-test-id="loginAndResetForm-getLoginAccountsBtn" @click="submit">
                            {{ !processing ? $t('mua.userLoginAndResetForm.loginBtnText') : '' }}
                            <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                                processing ? $t('mua.processing') : '' }}
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
            <v-container class="w-100">
                <v-col class="text-center justify-center align-center">
                    <p style="color: #888888;">Back to verification code?</p>
                    <p style="text-decoration: none;  color: #888888">
                        Enter the verification code from your authenticator app <span
                            class="text-primary font-weight-bold" style="cursor: pointer;"
                            @click="() => { recoveryMode = false }">Enter here</span>.
                    </p>
                </v-col>
            </v-container>
        </div>

    </v-layout>
</template>
