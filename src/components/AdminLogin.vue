<script setup >
import { ref } from 'vue'

import { useAdminsStore } from '../stores/index.js'

const adminStore = useAdminsStore()

const email = ref('')
const password = ref('')
const processing = ref(false)

const appIcon = import.meta.env.BASE_URL + 'bluefoxemail-logo.png'

async function submit () {
  const res = await adminStore.login(email.value, password.value)
  if (res) {
    processing.value = false
  }
}

</script>

<template>
    <v-layout class="d-flex flex-column justify-center align-center h-100">
        <v-card elevation="0">
            <v-card-text align="center" class="loggedOutState">
                <v-avatar size="80">
                    <v-img :src="appIcon" cover></v-img>
                </v-avatar>
            </v-card-text>
        </v-card>
        <v-card @keydown.enter="processing = true; submit()" class="ma-2 pa-2  rounded-xl  elevation-2" width="80%" max-width="600px">
            <v-card-text align="center">
                <p class="text-h6">{{ $t('mua.adminLogin.header') }}</p>
                <v-text-field hide-details density="compact" data-test-id="login-emailField"
                    class="my-5 rounded" color="info" variant="solo" name="email"
                    :label="$t('mua.adminLogin.emailLabel')" id="email" type="email" :placeholder="email || 'your@email.com'"
                    :value="email" @update:modelValue="res => email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')" required />
                <v-text-field hide-details density="compact" data-test-id="login-passwordField"
                    class="my-5 rounded" color="info" variant="solo" name="password"
                    :label="$t('mua.adminLogin.passwordLabel')" id="password" type="password"
                    :placeholder="password || '********'" :value="password"
                    @update:modelValue="res => password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')" active required />
                <v-btn color="info" data-test-id="login-submitBtn" @click="processing = true; submit()">
                    {{ !processing ? $t('mua.adminLogin.submitBtn') : '' }}

                    <v-progress-circular v-if="processing" :size="20"
                        indeterminate></v-progress-circular>{{ processing ? $t('mua.processing') : '' }}
                </v-btn>
            </v-card-text>
        </v-card>
        <v-container class="w-100">
            <v-col class="text-center justify-center align-center">
                <p style="color: #888888;">{{ $t('mua.adminLogin.resetPasswordMsg') }}</p>
                <router-link data-test-id="login-resetPasswordBtn" style="text-decoration: none; color: #888888;" class="font-weight-bold" to="/system-admins/forgot-password">{{ $t('mua.adminLogin.resetPasswordBtn') }}</router-link>
            </v-col>
        </v-container>
    </v-layout>
</template>
