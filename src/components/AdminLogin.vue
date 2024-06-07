<script setup >
import { ref } from 'vue'

import { useAdminsStore } from '../stores/index.js'

const adminStore = useAdminsStore()

const email = ref('')
const password = ref('')
const processing = ref(false)

const title = import.meta.env.VITE_APP_TITLE
const appIcon = import.meta.env.VITE_APP_ICON

async function submit () {
  const res = await adminStore.login(email.value, password.value)
  if (res) {
    processing.value = false
  }
}

</script>

<template>
    <v-form class="d-flex flex-column justify-center align-center h-screen">
        <v-card elevation="0">
            <v-card-text align="center">
                <v-avatar size="80">
                    <v-img :src="appIcon" cover></v-img>
                </v-avatar>
            </v-card-text>
            <v-card-title class="justify-center py-0">
                <h4 class="text-h4 text-center"> {{ title }} </h4>
            </v-card-title>
        </v-card>
        <v-card class="ma-2 pa-2  rounded-xl  elevation-2" width="80%" max-width="600px">
            <v-card-text align="center">
                <h6 class="text-h6">{{ $t('mua.adminLogin.header') }}</h6>
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
                <v-container class="mt-4 pa-4 pl-sm-0 w-100">
                    <v-row no-gutters class="justify-center align-center">
                    <v-col cols="12" sm="6" class="text-sm-right pr-sm-1 ">
                        <p>{{ $t('mua.adminLogin.resetPasswordMsg') }}</p>
                    </v-col>
                    <v-col cols="12" sm="5" class="text-sm-left">
                        <router-link data-test-id="login-resetPasswordBtn" style="text-decoration: none; color: inherit;"
                                        class="font-weight-bold" to="/system-admins/forgot-password">{{ $t('mua.adminLogin.resetPasswordBtn') }}</router-link>
                    </v-col>
                    </v-row>
                </v-container>
                <button hidden @click.enter.prevent="processing = true; submit()" />
            </v-card-text>
        </v-card>
    </v-form>
</template>
