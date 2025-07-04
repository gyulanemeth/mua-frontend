<script setup>
import { ref, watch } from 'vue'
import CreateWithProvider from './CreateWithProvider.vue'
import { useCaptchaStore } from '../stores/index.js'

const data = ref({
  user: { email: '', name: '', password: '', newPasswordAgain: '' },
  account: { urlFriendlyName: '', name: '' }
})

const captchaStore = useCaptchaStore()

const captchaData = ref()
const cb = ref()
const appIcon = import.meta.env.VITE_APP_LOGO_URL
const url = import.meta.env.VITE_APP_BASE_URL
const terms = import.meta.env.VITE_APP_TERMS_URL
const privacy = import.meta.env.VITE_APP_PRIVACY_URL
const processing = ref(false)
const checkbox = ref()
const urlFriendlyNameFocused = ref(false)
const step = ref(1)
const countDown = ref(15)
const show = ref(false)

function startCountDownt () {
  if (cb.value && cb.value.success) {
    const intervalId = setInterval(() => {
      if (countDown.value !== 0) {
        countDown.value = countDown.value - 1
      }
    }, 1000)
    setTimeout(() => {
      clearInterval(intervalId)
      show.value = false
    }, 15000)
  }
}

async function generateCaptcha () {
  const res = await captchaStore.getCaptcha()
  captchaData.value = res.data
  data.value.captchaProbe = res.probe
}

generateCaptcha()

watch(() => data.value.account.name, () => {
  if (!urlFriendlyNameFocused.value) {
        data.value.account.urlFriendlyName = data.value.account.name.replace(/[^a-z0-9/ \.,_-]/gim, '').replace(' ', '-').toLowerCase()/* eslint-disable-line */
  }
})

watch(() => data.value.account.urlFriendlyName, () => {
    data.value.account.urlFriendlyName = data.value.account.urlFriendlyName.replace(/[^a-z0-9/ \.,_-]/gim, '').replace(' ', '-').toLowerCase()/* eslint-disable-line */
})

</script>

<template>

    <v-layout style="z-index: 10;" v-if="!cb || !cb.success" class="d-flex flex-column justify-center align-center h-100">
        <v-card elevation="0">
            <v-card-text align="center" class="loggedOutState">
                <v-avatar size="80">
                    <v-img :src="appIcon" cover></v-img>
                </v-avatar>
            </v-card-text>
        </v-card>
        <v-card class="ma-2 pa-2  rounded-xl  elevation-2" width="80%" max-width="600px">
            <v-card-text align="center">
                <v-btn v-if="step === 2" @click="step = 1" style="position: absolute; left: 25px;" density="compact"
                    class="ma-0 pa-0" variant="outlined" color="primary" icon="mdi-arrow-left"></v-btn>
                <p class="text-h6">{{ $t('mua.createAccount.header') }}</p>
                <div v-if="step === 1">
                    <v-divider class="my-3" />
                    <p class="ma-10 d-inline text-body-2 font-weight-bold">{{ $t('mua.createAccount.userSection.header')
                    }}</p><v-divider class=" mt-3 mb-6" />

                    <v-text-field hide-details density="compact" class="my-5 rounded" color="primary" variant="solo"
                        name="email" type="email" :label="$t('mua.createAccount.userSection.emailLabel')"
                        :placeholder="data.user.email || $t('mua.createAccount.userSection.emailPlaceHolder')"
                        :disabled="data.user.googleProfileId" data-test-id="createAccount-emailField"
                        :value="data.user.email"
                        @update:modelValue="res => data.user.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
                        v-model="data.user.email"
                        @input="(event) => data.user.email = event.target.value.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
                        required />

                    <v-text-field hide-details data-test-id="createAccount-userNameField" density="compact"
                        class="my-5 rounded" color="primary" variant="solo" placeholder="Your Name" name="name"
                        label="Name" type="text" v-model="data.user.name" required />

                    <v-text-field v-if="!data.user.googleProfileId" hide-details density="compact" class="my-5 rounded"
                        color="primary" variant="solo" name="newPassword" data-test-id="createAccount-newPasswordField"
                        :label="$t('mua.createAccount.userSection.newPasswordLabel')" type="password"
                        :placeholder="data.user.password || $t('mua.createAccount.userSection.newPasswordPlaceholder')"
                        v-model="data.user.password" required />

                    <v-text-field v-if="!data.user.googleProfileId" hide-details density="compact" class="my-5 rounded"
                        color="primary" variant="solo" name="newPasswordAgain"
                        data-test-id="createAccount-newPasswordAgainField"
                        :label="$t('mua.createAccount.userSection.confirmNewPasswordLabel')" type="password"
                        :placeholder="data.user.newPasswordAgain || $t('mua.createAccount.userSection.confirmNewPasswordPlaceholder')"
                        v-model="data.user.newPasswordAgain" required />

                    <v-col>
                        <v-btn color="primary"
                            :disabled="!(data.user.name?.length > 0 && data.user.email?.length > 0 && ((data.user.password?.length > 0 && data.user.newPasswordAgain?.length > 0) || data.user.googleProfileId?.length > 0))"
                            data-test-id="createAccount-nextStepBtn" @click="step = 2">

                            next step

                        </v-btn>
                    </v-col>
                    <CreateWithProvider v-if="!data.user.googleProfileId"
                        @updateUserData="(val) => { data.user.name = val.name; data.user.email = val.email; data.user.googleProfileId = val.id; data.user.profilePicture = val.profilePicture; step = 2 }" />
                </div>
                <div v-if="step === 2"
                    @keydown.enter="checkbox ? (processing = true, $emit('buttonEvent', data, (res) => { cb = res; processing = false; startCountDownt(); res.message? generateCaptcha(): null })) : null">
                    <v-divider class="my-3" />
                    <p class="ma-10 d-inline text-body-2 font-weight-bold">{{
                        $t('mua.createAccount.accountSection.header') }}</p>

                    <v-divider class=" mt-3 mb-6" />
                    <v-banner icon="mdi-lightbulb-outline" color="blue-lighten-4" class="elevation-5 bg-blue-lighten-5">
                        <v-banner-text style="overflow-y: auto;" class="text-primary px-0">
                            <p class="text-left">{{ $t('mua.createAccount.accountSection.banner') }}</p>
                        </v-banner-text>
                    </v-banner>
                    <v-text-field hide-details density="compact" data-test-id="createAccount-accNameField"
                        class=" my-5 rounded" color="primary" variant="solo" name="AccName" type="text"
                        :label="$t('mua.createAccount.accountSection.nameLabel')" v-model="data.account.name"
                        :placeholder="$t('mua.createAccount.accountSection.namePlaceholder')" required />

                    <v-text-field hide-details @update:focused="() => { urlFriendlyNameFocused = true }" density="compact"
                        class="my-5 rounded mb-0 pb-0" data-test-id="createAccount-urlFriendlyNameField" color="primary"
                        variant="solo" name="urlFriendlyName" type="text"
                        :label="$t('mua.createAccount.accountSection.urlFriendlyNameLabel')"
                        :placeholder="data.account.urlFriendlyName || $t('mua.createAccount.accountSection.urlFriendlyNamePlaceholder')"
                        v-model="data.account.urlFriendlyName" required />
                    <div class="justify-left align-left text-left w-100">
                        <span class="text-grey-darken-1 text-caption ml-1 pt-0 mt-1">{{ url + 'accounts/' +
                            data.account.urlFriendlyName }}</span>
                    </div>

                    <div class="d-flex flex-wrap align-center justify-center">
                        <div v-html="captchaData"></div><v-btn density="compact" size="large"
                            class="rounded-0 elevation-0 mr-2" @click="generateCaptcha()" icon="mdi-refresh" />
                        <v-text-field hide-details data-test-id="forgotPassword-captchaField" density="compact"
                            class=" my-5 rounded" color="primary" variant="solo" name="captchaText" type="text"
                            :placeholder="'Captcha text'" v-model="data.captchaText" required />
                    </div>

                    <div v-if="terms && privacy" class="d-flex align-center justify-start my-2" style="width: 100%;">
                        <v-checkbox color="primary" v-model="checkbox" hide-details></v-checkbox>
                        <p >{{ $t('mua.termsAndCondition.checkboxLabe') }}
                            <a style="color: #3949AB; cursor: pointer;" target=“_blank”
                                class="text-decoration-underline font-weight-medium text-body-2"
                                :href="terms">{{ $t('mua.termsAndCondition.terms') }}</a> and
                            <a style="color: #3949AB; cursor: pointer;" target=“_blank”
                                class="text-decoration-underline font-weight-medium text-body-2"
                                :href="privacy">{{ $t('mua.termsAndCondition.privacy') }}</a>
                        </p>
                    </div>

                    <v-col>
                        <v-btn color="primary" data-test-id="createAccount-submitBtn"
                            :disabled="!checkbox || data.account.name.length === 0 || data.account.urlFriendlyName.length === 0"
                            @click="processing = true; $emit('buttonEvent', data, (res) => { cb = res; processing = false; startCountDownt(); res.message? generateCaptcha() : null })">

                            {{ !processing ? $t('mua.createAccount.submitBtn') : '' }}

                            <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                                processing ? $t('mua.processing') : '' }}

                        </v-btn>
                    </v-col>
                </div>
            </v-card-text>
        </v-card>
        <v-container class="w-100">
            <v-col class="text-center justify-center align-center">
                <p style="color: #888888" class="text-center">{{ $t('mua.createAccount.redirectTologinMessage') }}</p>
                <router-link style="text-decoration: none; color: #888888;" class="font-weight-bold"
                    :to="`/accounts/login`">{{ $t('mua.createAccount.loginBtn') }}</router-link>
            </v-col>
        </v-container>
    </v-layout>
    <v-layout style="z-index: 10;" v-else class="d-flex flex-column justify-center align-center h-100">
        <v-card elevation="0">
            <v-card-text align="center" class="loggedOutState">
                <v-avatar size="80">
                    <v-img :src="appIcon" cover></v-img>
                </v-avatar>
            </v-card-text>
        </v-card>
        <v-card class="  rounded-xl  elevation-2  d-flex flex-column justify-center align-right  " width="80%"
            max-width="600px">
            <v-card-text align="left">
                <p class="text-h5 text-center text-green">{{ $t('mua.createAccount.cbHeader') }}</p>

                <p class="mt-3 pa-2">{{ $t('mua.createAccount.cbMessagePart1') }}</p>
                <p class="pa-2">{{ $t('mua.createAccount.cbMessagePart2') }}</p>
            </v-card-text>
            <v-card-actions class="align-center justify-center mb-5 mt-0 pt-0">
                <v-tooltip location="top" v-model="show">
                    <template v-slot:activator="{ props }">
                        <div v-bind="countDown !== 0 && props">
                            <v-btn color="primary" variant="elevated" :disabled="countDown !== 0"
                                @click="$emit('reSendFinalizeRegistrationEvent', { accountId: cb.newAccount._id, userId: cb.newUser._id })">

                                {{ $t('mua.createAccount.resendBtn') }}

                            </v-btn>
                        </div>
                    </template>
                    <span v-if="countDown !== 0"> {{ $t('mua.createAccount.cbResendMsg') }} {{ countDown }}</span>
                </v-tooltip>
            </v-card-actions>
        </v-card>
        <v-container class="w-100">
            <v-col class="text-center justify-center align-center">
                <p style="color: #888888" class="text-center text-subtitle-2">{{ $t('mua.createAccount.loginMessage') }}
                </p>
                <router-link style="text-decoration: none; color: #888888;" class="font-weight-bold"
                    :to="`/accounts/login`">{{
                        $t('mua.createAccount.loginBtn') }}</router-link>
            </v-col>
        </v-container>
    </v-layout>

</template>
