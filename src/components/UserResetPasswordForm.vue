<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCaptchaStore } from '../stores/index.js'

const props = defineProps({
  formData: Object
})

const captchaStore = useCaptchaStore()
const route = useRoute()

const captchaData = ref()
const data = ref({})
const cb = ref(false)
const processing = ref(false)

if (props.formData.email) {
  data.value.email = ref(props.formData.email)
}

if (props.formData.account) {
  data.value.account = ref(props.formData.account)
}
const appIcon = import.meta.env.VITE_APP_LOGO_URL

async function generateCaptcha () {
  const res = await captchaStore.getCaptcha()
  captchaData.value = res.data
  data.value.captchaProbe = res.probe
}

generateCaptcha()
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
        <v-card class="ma-2 pa-2 rounded-xl elevation-2" width="80%" max-width="600px">
            <v-card-text align="center">
                <p class="text-h6 mb-1">{{ $t('mua.userLoginAndResetForm.resetHeader') }}</p>

                <!-- Reset password form (from email link) -->
                <div v-if="route.name === 'accounts-forgot-password-reset'">
                    <p class="text-body-2 text-medium-emphasis mb-1">{{ props.formData.account?.name }}</p>
                    <p v-if="props.formData.email" class="text-body-2 text-medium-emphasis mb-5">{{ props.formData.email }}</p>
                    <div v-if="!cb" @keydown.enter="$emit('handleForgotPasswordResetHandler', data, () => {})">
                        <v-text-field hide-details data-test-id="loginAndResetForm-newPasswordField" density="compact"
                            class="mb-4 rounded" color="primary" variant="solo" name="password"
                            :label="$t('mua.userLoginAndResetForm.newPasswordLabel')" type="password"
                            :placeholder="data.password || $t('mua.userLoginAndResetForm.newPasswordPlaceholder')"
                            :value="data.password"
                            @update:modelValue="res => data.password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                            required />
                        <v-text-field hide-details density="compact" class="mb-4 rounded" color="primary"
                            variant="solo" name="confirmPassword" data-test-id="loginAndResetForm-newPasswordAgainField"
                            :label="$t('mua.userLoginAndResetForm.confirmNewPasswordLabel')" type="password"
                            :placeholder="data.confirmPassword || $t('mua.userLoginAndResetForm.confirmNewPasswordPlaceholder')"
                            :value="data.confirmPassword"
                            @update:modelValue="res => data.confirmPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                            required />
                        <v-btn block color="primary" :disabled="!data.password || !data.confirmPassword"
                            data-test-id="loginAndResetForm-submitBtn"
                            @click="$emit('handleForgotPasswordResetHandler', data, () => {})">
                            {{ $t('mua.userLoginAndResetForm.resetBtnText') }}
                        </v-btn>
                    </div>
                </div>

                <!-- Send reset link form -->
                <div v-else>
                    <p class="text-body-2 text-medium-emphasis mb-1">{{ props.formData.account?.name }}</p>
                    <p v-if="props.formData.email" class="text-body-2 text-medium-emphasis mb-5">{{ props.formData.email }}</p>
                    <div v-if="cb !== 'reset'"
                        @keydown.enter="data.captchaText ? processing = true && $emit('handleForgotPasswordHandler', data, (res) => { res ? cb = res : null; generateCaptcha(); processing = false }) : null">
                        <v-text-field v-if="!props.formData.email" hide-details data-test-id="loginAndResetForm-emailField"
                            density="compact" class="mb-4 rounded" color="primary" variant="solo"
                            type="email" name="email"
                            :placeholder="$t('mua.userLoginAndResetForm.emailPlaceHolder')" :value="data.email"
                            @update:modelValue="res => data.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')" required />
                        <div class="d-flex flex-wrap align-center justify-center mb-4">
                            <div v-html="captchaData"></div>
                            <v-btn density="compact" size="large" class="rounded-0 elevation-0 mr-2"
                                @click="generateCaptcha()" icon="mdi-refresh" />
                            <v-text-field hide-details data-test-id="forgotPassword-captchaField" density="compact"
                                class="mt-3 rounded" color="primary" variant="solo" name="captchaText" type="text"
                                :placeholder="'Captcha text'" v-model="data.captchaText" required />
                        </div>
                        <v-btn block color="primary" :disabled="!data.captchaText || !data.account || !data.email"
                            data-test-id="loginAndResetForm-forgotPasswordBtn"
                            @click="processing = true; $emit('handleForgotPasswordHandler', data, (res) => { res ? cb = res : null; generateCaptcha(); processing = false })">
                            {{ !processing ? $t('mua.userLoginAndResetForm.resetBtnText') : '' }}
                            <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                                processing ? $t('mua.processing') : '' }}
                        </v-btn>
                    </div>
                    <div v-else class="py-4" data-test-id="loginAndResetForm-forgotPasswordCb">
                        <v-icon size="48" color="primary" class="mb-3">mdi-email-fast-outline</v-icon>
                        <p class="text-h6 mb-2">{{ $t('mua.userLoginAndResetForm.cb.resetMessage') }}</p>
                    </div>
                </div>
            </v-card-text>
        </v-card>
        <v-container class="w-100" v-if="route.name !== 'accounts-forgot-password-reset' && cb !== 'reset'">
            <v-col class="text-center justify-center align-center">
                <p style="color: #888888;">{{ $t('mua.userLoginAndResetForm.redirectToLoginMessage') }}</p>
                <router-link style="text-decoration: none; color: #888888;" class="font-weight-bold"
                    :to="`/accounts/login/${route.query.urlFriendlyName ? route.query.urlFriendlyName : ''}`">{{
                        $t('mua.userLoginAndResetForm.redirectToLoginBtn') }}</router-link>
            </v-col>
        </v-container>
    </v-layout>
</template>
