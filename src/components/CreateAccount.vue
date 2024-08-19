<script setup>
import { ref } from 'vue'

const data = ref({
  user: { email: '', name: '', password: '', newPasswordAgain: '' },
  account: { urlFriendlyName: '', name: '' }
})

const cb = ref()
const appIcon = import.meta.env.BASE_URL + 'bluefoxemail-logo.png'
const url = import.meta.env.VITE_APP_BASE_URL
const processing = ref(false)
const checkbox = ref()
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

</script>

<template>

    <v-layout v-if="!cb || !cb.success" class="d-flex flex-column justify-center align-center h-100">
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
                    class="ma-0 pa-0" variant="outlined" color="info" icon="mdi-arrow-left"></v-btn>
                <h6 class="text-h6">{{ $t('mua.createAccount.header') }}</h6>
                <div v-if="step === 1">
                    <v-divider class="my-3" />
                    <h4 class="ma-10 d-inline">{{ $t('mua.createAccount.userSection.header') }}</h4><v-divider
                        class=" mt-3 mb-6" />

                    <v-text-field hide-details density="compact" class="my-5 rounded" color="info" variant="solo"
                        name="email" type="email" :label="$t('mua.createAccount.userSection.emailLabel')"
                        :placeholder="data.user.email || $t('mua.createAccount.userSection.emailPlaceHolder')"
                        data-test-id="createAccount-emailField" :value="data.user.email"
                        @update:modelValue="res => data.user.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
                        v-model="data.user.email"
                        @input="(event) => data.user.email = event.target.value.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
                        required />

                    <v-text-field hide-details data-test-id="createAccount-userNameField" density="compact"
                        class="my-5 rounded" color="info" variant="solo" placeholder="Your Name" name="name"
                        label="Name" type="text" v-model="data.user.name" required />

                    <v-text-field hide-details density="compact" class="my-5 rounded" color="info" variant="solo"
                        name="newPassword" data-test-id="createAccount-newPasswordField"
                        :label="$t('mua.createAccount.userSection.newPasswordLabel')" type="password"
                        :placeholder="data.user.password || $t('mua.createAccount.userSection.newPasswordPlaceholder')"
                        v-model="data.user.password" required />

                    <v-text-field hide-details density="compact" class="my-5 rounded" color="info" variant="solo"
                        name="newPasswordAgain" data-test-id="createAccount-newPasswordAgainField"
                        :label="$t('mua.createAccount.userSection.confirmNewPasswordLabel')" type="password"
                        :placeholder="data.user.newPasswordAgain || $t('mua.createAccount.userSection.confirmNewPasswordPlaceholder')"
                        v-model="data.user.newPasswordAgain" required />

                    <v-col>
                        <v-btn color="info"
                            :disabled="data.user.name.length === 0 || data.user.newPasswordAgain.length === 0 || data.user.password.length === 0 || data.user.email.length === 0"
                            data-test-id="createAccount-nextStepBtn" @click="step = 2">

                            next step

                        </v-btn>
                    </v-col>
                </div>
                <div v-if="step === 2"
                    @keydown.enter="checkbox ? processing = true && $emit('buttonEvent', data, (res) => { cb = res; processing = false; startCountDownt() }) : null">
                    <v-divider class="my-3" />
                    <h4 class="ma-10 d-inline">{{ $t('mua.createAccount.accountSection.header') }}</h4>

                    <v-divider class=" mt-3 mb-6" />
                    <v-banner icon="mdi-lightbulb-outline" color="blue-lighten-4" class="elevation-5 bg-blue-lighten-5">
                        <v-banner-text style="overflow-y: auto;" class="text-info px-0">
                            <p class="text-left">{{ $t('mua.createAccount.accountSection.banner') }}</p>
                        </v-banner-text>
                    </v-banner>
                    <v-text-field hide-details density="compact" data-test-id="createAccount-accNameField"
                        class=" my-5 rounded" color="info" variant="solo" name="AccName" type="text"
                        :label="$t('mua.createAccount.accountSection.nameLabel')" v-model="data.account.name"
                        :placeholder="$t('mua.createAccount.accountSection.namePlaceholder')" required />

                    <v-text-field hide-details density="compact" class="my-5 rounded mb-0 pb-0"
                        data-test-id="createAccount-urlFriendlyNameField" color="info" variant="solo"
                        name="urlFriendlyName" type="text"
                        :label="$t('mua.createAccount.accountSection.urlFriendlyNameLabel')"
                        :placeholder="data.account.urlFriendlyName || $t('mua.createAccount.accountSection.urlFriendlyNamePlaceholder')"
                        :value="data.account.urlFriendlyName"
                        @update:modelValue="res => data.account.urlFriendlyName = res.replace(/[^a-z0-9/ \.,_-]/gim, '').replace(' ', '-').toLowerCase()"
                        required />
                    <div class="justify-left align-left text-left w-100">
                        <span class="text-grey-darken-1 text-caption ml-1 pt-0 mt-1">{{ url + 'accounts/' +
                            data.account.urlFriendlyName }}</span>
                    </div>

                    <v-checkbox :label="$t('mua.createAccount.checkboxLabel')" color="info" v-model="checkbox"
                        hide-details></v-checkbox>

                    <v-col>
                        <v-btn color="info" data-test-id="createAccount-submitBtn"
                            :disabled="!checkbox || data.account.name.length === 0 || data.account.urlFriendlyName.length === 0"
                            @click="processing = true; $emit('buttonEvent', data, (res) => { cb = res; processing = false; startCountDownt() })">

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
    <v-layout v-else class="d-flex flex-column justify-center align-center h-100">
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
                <h4 class="text-h5 text-center text-green">{{ $t('mua.createAccount.cbHeader') }}</h4>

                <p class="mt-3 pa-2">{{ $t('mua.createAccount.cbMessagePart1') }}</p>
                <p class="pa-2">{{ $t('mua.createAccount.cbMessagePart2') }}</p>
            </v-card-text>
            <v-card-actions class="align-center justify-center mb-5 mt-0 pt-0">
                <v-tooltip location="top" v-model="show">
                    <template v-slot:activator="{ props }">
                        <div v-bind="countDown !== 0 && props">
                            <v-btn color="info" variant="elevated" :disabled="countDown !== 0"
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
