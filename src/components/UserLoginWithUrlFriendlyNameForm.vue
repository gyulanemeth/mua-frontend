<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import LoginWithProvider from './LoginWithProvider.vue'

const props = defineProps({
  formData: Object
})

const route = useRoute()

const data = ref({})
const processing = ref(false)
const appIcon = import.meta.env.VITE_APP_LOGO_URL
const url = ref(window.location.origin + window.location.pathname)
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
            <v-card-text align="center"
                @keydown.enter="processing = true; $emit('handleLoginWithUrlFriendlyName', { email: data.email, password: data.password, urlFriendlyName: props.formData.urlFriendlyName }, () => { processing = false })">
                <p class="text-h6">{{ $t('mua.userLoginAndResetForm.loginUrlFriendlyNameHeader', {
                    name:
                        props.formData.accountName
                }) }} </p>
                <p class="text-subtitle-1" style="white-space: normal; word-wrap: break-word;">({{ url }})</p>

                <v-text-field hide-details data-test-id="loginAndResetForm-emailField" density="compact"
                    class="my-5 rounded" color="primary" variant="solo" type="email" name="email"
                    :label="'Email'"
                    :placeholder="data.email || $t('mua.userLoginAndResetForm.emailPlaceHolder')" :value="data.email"
                    @update:modelValue="res => data.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')" required />

                <v-text-field hide-details density="compact" class="my-5 rounded" color="primary" variant="solo"
                    name="password" data-test-id="loginAndResetForm-passwordField"
                    :label="$t('mua.userLoginAndResetForm.passwordLabel')" type="password"
                    :placeholder="data.password || $t('mua.userLoginAndResetForm.passwordPlaceholder')"
                    :value="data.password"
                    @update:modelValue="res => data.password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                    required />

                <div>
                    <v-btn color="primary" data-test-id="loginAndResetForm-getLoginAccountsBtn"
                        @click="processing = true; $emit('handleLoginWithUrlFriendlyName', { email: data.email, password: data.password, urlFriendlyName: props.formData.urlFriendlyName }, () => { processing = false })">
                        {{ !processing ? $t('mua.userLoginAndResetForm.loginBtnText') : '' }}
                        <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                            processing ? $t('mua.processing') : '' }}
                    </v-btn>
                </div>
            </v-card-text>
            <LoginWithProvider :accountId="props.formData._id" />

        </v-card>
        <v-container class="w-100">
            <v-col class="text-center justify-center align-center">
                <p style="color: #888888;">{{ $t('mua.userLoginAndResetForm.forgotHeader') }}</p>
                <router-link style="text-decoration: none; color: #888888;"
                    data-test-id="loginAndResetForm-resetPasswordBtn" class="font-weight-bold"
                    :to="`/accounts/forgot-password?urlFriendlyName=${route.params.urlFriendlyName}`">{{
                        $t('mua.userLoginAndResetForm.forgotBtn')
                    }}</router-link>
                <p style="color: #888888;" class="mt-2"> {{
                    $t('mua.userLoginAndResetForm.cb.loginToDifferentAccountMessage') }}</p>
                <router-link data-test-id="loginAndResetForm-createAccountBtn"
                    style="text-decoration: none;  color: #888888;" class="font-weight-bold" to="/accounts/login">{{
                        $t('mua.userLoginAndResetForm.cb.loginToDifferentAccountCbBtn') }}</router-link>
                <p style="color: #888888;" class="mt-2"> {{ $t('mua.userLoginAndResetForm.cb.forgotMessage') }}</p>
                <router-link data-test-id="loginAndResetForm-createAccountBtn"
                    style="text-decoration: none;  color: #888888;" class="font-weight-bold"
                    to="/accounts/create-account">{{
                        $t('mua.userLoginAndResetForm.cb.forgotCbBtn') }}</router-link>
            </v-col>
        </v-container>
    </v-layout>
</template>
