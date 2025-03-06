<script setup>
import { ref } from 'vue'
import { useCaptchaStore } from '../stores/index.js'

const cb = ref()
const data = ref({})
const captchaStore = useCaptchaStore()
const processing = ref(false)
const captchaData = ref()
const appIcon = import.meta.env.VITE_APP_LOGO_URL

async function generateCaptcha () {
  const res = await captchaStore.getCaptcha()
  captchaData.value = res.data
  data.value.captchaProbe = res.text
}

generateCaptcha()
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
        <v-card class="ma-2 pa-2  rounded-xl  elevation-2" width="80%" max-width="600px">
            <v-card-text align="center">
                <p class="text-h6">{{ $t('mua.adminForgotPasswordForm.header') }}</p>

                <v-text-field hide-details data-test-id="forgotPassword-emailField" density="compact"
                    class=" mt-5 rounded" color="primary" variant="solo" name="email"
                    :label="$t('mua.adminForgotPasswordForm.emailLabel')" type="email" :disabled="cb"
                    :placeholder="data.email || $t('mua.adminForgotPasswordForm.emailPlaceHolder')" :value="data.email"
                    @update:modelValue="res => data.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')" required />

                <div v-if="!cb" class="d-flex flex-wrap align-center justify-center">
                    <v-text-field hide-details data-test-id="forgotPassword-captchaField" density="compact"
                        class=" my-5 rounded" color="primary" variant="solo" name="captchaText" type="text"
                        :placeholder="'Captcha text'" v-model="data.captchaText" required />
                    <div v-html="captchaData"></div>
                </div>

                <div v-if="!cb"
                    @keydown.enter="data.captchaText ? processing = true && $emit('passwordRecoveryEventHandler', data, (res) => { if (res) { cb = res } generateCaptcha(); processing = false; }) : null">
                    <v-btn data-test-id="forgotPassword-submitBtn" :disabled="!data || !data.captchaText || !data.email" color="primary"
                        @click="processing = true; $emit('passwordRecoveryEventHandler', data, (res) => { if (res) { cb = res } generateCaptcha(); processing = false; })">

                        {{ !processing ? $t('mua.adminForgotPasswordForm.submitBtn') : '' }}

                        <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                            processing ? $t('mua.processing') : '' }}

                    </v-btn>

                </div>
                <div v-if="cb">

                    <p class="mt-4">{{ $t('mua.adminForgotPasswordForm.cb.message') }}</p>
                    <v-btn color="white" data-test-id="forgotPassword-continueBtn" class="mt-4"
                        to="/system-admins/login">{{
                            $t('mua.adminForgotPasswordForm.cb.cbBtn') }}</v-btn>
                </div>
            </v-card-text>

        </v-card>

        <v-container v-if="!cb" class="w-100">
            <v-col class="text-center justify-center align-center ">
                <p style="color: #888888;">{{ $t('mua.adminForgotPasswordForm.redirectToLoginMessage') }}</p>
                <router-link style="text-decoration: none; color: #888888;" class="font-weight-bold"
                    to="/system-admins/login">{{
                        $t('mua.adminForgotPasswordForm.redirectToLoginBtn') }}</router-link>
            </v-col>
        </v-container>
    </v-layout>
</template>
