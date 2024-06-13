<script setup >
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import jwtDecode from 'jwt-decode'

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

const appIcon = import.meta.env.VITE_APP_ICON
const title = import.meta.env.VITE_APP_TITLE

</script>

<template>
    <v-layout class="d-flex flex-column justify-center align-center h-screen">
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
            <v-card-text align="center" v-if="!cb">
                <h6 class="text-h6">{{ props.formData.header }}</h6>

                <v-text-field hide-details density="compact" class="my-5 rounded" color="info"
                    variant="solo" name="email" type="text" :value="tokenData.user.email"
                    :placeholder="tokenData.user.email" disabled required />

                <v-text-field hide-details density="compact" class=" my-5 rounded" color="info"
                    variant="solo" name="urlFriendlyName" type="text" :value="tokenData.account.urlFriendlyName"
                    :placeholder="tokenData.account.urlFriendlyName" disabled required />

                <v-text-field hide-details density="compact" data-test-id="acceptInvitation-nameField"
                    class=" my-5 rounded" color="info" variant="solo" placeholder="Your Name"
                    name="name" label="Name" type="text" v-model="data.name" required />

                <v-text-field hide-details density="compact" data-test-id="acceptInvitation-newPasswordField"
                    class=" my-5 rounded" color="info" variant="solo" name="newPassword"
                    :label="$t('mua.acceptInvitationForm.newPasswordLabel')" type="password"
                    :placeholder="data.newPassword || $t('mua.acceptInvitationForm.newPasswordPlaceholder')"
                    :value="data.newPassword"
                    @update:modelValue="res => data.newPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')" required />

                <v-text-field hide-details density="compact" data-test-id="acceptInvitation-newPasswordAgainField"
                    class=" my-5 rounded" color="info" variant="solo" name="newPasswordAgain"
                    :label="$t('mua.acceptInvitationForm.confirmNewPasswordLabel')" type="password"
                    :placeholder="data.newPasswordAgain || $t('mua.acceptInvitationForm.confirmNewPasswordPlaceholder')"
                    :value="data.newPasswordAgain"
                    @update:modelValue="res => data.newPasswordAgain = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                    required />
                <v-checkbox :label="$t('mua.acceptInvitationForm.checkboxLabel')" color="info" v-model="checkbox"
                    hide-details></v-checkbox>
                <v-col>
                    <v-btn color="info" data-test-id="acceptInvitation-submitBtn" :disabled="!checkbox"
                        @click="processing = true; $emit('handleAcceptInvitationHandler', data, () => { processing = false })">
                        {{ !processing ? props.formData.btnText : '' }}

                        <v-progress-circular v-if="processing" :size="20"
                            indeterminate></v-progress-circular>{{ processing ? $t('mua.processing') : '' }}

                    </v-btn>
                    <button hidden :disabled="!checkbox"
                        @click.enter.prevent="$emit('handleAcceptInvitationHandler', data, () => { processing = false })" />
                </v-col>
            </v-card-text>
            <v-card-text align="center" v-if="cb">

                <h2 class="mt-4" data-test-id="acceptInvitation-headerCb">{{ $t('mua.acceptInvitationForm.cb.header') }}</h2>
                <p class="mt-4">{{ $t('mua.acceptInvitationForm.cb.message') }}
                    <router-link tag="span" style="text-decoration: none; color: inherit;" to="/accounts/"
                        class="font-weight-bold">{{$t('mua.acceptInvitationForm.cb.cbBtn')}}</router-link>
                    {{$t('mua.acceptInvitationForm.cb.subMessage')}}
            </p>

        </v-card-text>

    </v-card>
</v-layout></template>
