<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import jwtDecode from 'jwt-decode'
import CreateWithProvider from './CreateWithProvider.vue'

const props = defineProps({
  formData: Object
})

const route = useRoute()

const processing = ref(false)
const tokenData = ref()
const data = ref({})
const cb = ref()
const checkbox = ref()
tokenData.value = jwtDecode(route.query.token)
const terms = import.meta.env.VITE_APP_TERMS_URL
const privacy = import.meta.env.VITE_APP_PRIVACY_URL
const appIcon = import.meta.env.BASE_URL + 'bluefoxemail-logo.png'

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
            <v-card-text @keydown.enter="$emit('handleAcceptInvitationHandler', data, () => { processing = false })"
                align="center" v-if="!cb">
                <p class="text-h6">{{ props.formData.header }}</p>

                <v-text-field hide-details density="compact" class="my-5 rounded" color="info" variant="solo"
                    name="email" type="text" :value="tokenData.user.email" :placeholder="tokenData.user.email" disabled
                    required />

                <v-text-field hide-details density="compact" class=" my-5 rounded" color="info" variant="solo"
                    name="urlFriendlyName" type="text" :value="tokenData.account.urlFriendlyName"
                    :placeholder="tokenData.account.urlFriendlyName" disabled required />

                <v-text-field hide-details density="compact" data-test-id="acceptInvitation-nameField"
                    class=" my-5 rounded" color="info" variant="solo" placeholder="Your Name" name="name" label="Name"
                    type="text" v-model="data.name" required />

                <v-text-field hide-details density="compact" data-test-id="acceptInvitation-newPasswordField"
                    class=" my-5 rounded" color="info" variant="solo" name="newPassword"
                    :label="$t('mua.acceptInvitationForm.newPasswordLabel')" type="password"
                    :placeholder="data.newPassword || $t('mua.acceptInvitationForm.newPasswordPlaceholder')"
                    :value="data.newPassword"
                    @update:modelValue="res => data.newPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                    required />

                <v-text-field hide-details density="compact" data-test-id="acceptInvitation-newPasswordAgainField"
                    class=" my-5 rounded" color="info" variant="solo" name="newPasswordAgain"
                    :label="$t('mua.acceptInvitationForm.confirmNewPasswordLabel')" type="password"
                    :placeholder="data.newPasswordAgain || $t('mua.acceptInvitationForm.confirmNewPasswordPlaceholder')"
                    :value="data.newPasswordAgain"
                    @update:modelValue="res => data.newPasswordAgain = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                    required />

                    <div class="d-flex align-center justify-start my-2" style="width: 100%;">
                        <v-checkbox color="info" v-model="checkbox" hide-details></v-checkbox>
                        <p v-if="terms && privacy" >{{  $t('mua.termsAndCondition.checkboxLabe') }}
                            <a style="color: #3949AB; cursor: pointer;" target=“_blank” class="text-decoration-underline font-weight-medium text-body-2" :href="terms">{{$t('mua.termsAndCondition.terms')}}</a> and
                            <a  style="color: #3949AB; cursor: pointer;" target=“_blank” class="text-decoration-underline font-weight-medium text-body-2" :href="privacy">{{$t('mua.termsAndCondition.privacy')}}</a>
                        </p>
                        <p v-else> {{$t('mua.acceptInvitationForm.checkboxLabel')}}</p>
                    </div>

                <v-col>
                    <v-btn color="info" data-test-id="acceptInvitation-submitBtn" :disabled="!checkbox"
                        @click="processing = true; $emit('handleAcceptInvitationHandler', data, () => { processing = false })">
                        {{ !processing ? props.formData.btnText : '' }}

                        <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                            processing ? $t('mua.processing') : '' }}

                    </v-btn>
                </v-col>
            </v-card-text>
            <CreateWithProvider :accountId="tokenData.account._id" :userId="tokenData.user._id" />
            <v-card-text align="center" v-if="cb">

                <p class="mt-4 text-h6 font-weight-bold" style="color: #888888;"
                    data-test-id="acceptInvitation-headerCb">{{ $t('mua.acceptInvitationForm.cb.header') }}</p>
                <p class="mt-4">{{ $t('mua.acceptInvitationForm.cb.message') }}
                    <router-link tag="span" style="text-decoration: none; color: #888888" to="/accounts/"
                        class="font-weight-bold">{{ $t('mua.acceptInvitationForm.cb.cbBtn') }}</router-link>
                    {{ $t('mua.acceptInvitationForm.cb.subMessage') }}
                </p>

            </v-card-text>

        </v-card>
    </v-layout></template>
