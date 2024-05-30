<script setup >
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  formData: Object
})

const route = useRoute()
const data = ref({})
const cb = ref(false)
const processing = ref(false)
const checkbox = ref()

if (props.formData.email) {
  data.value.email = ref(props.formData.email)
}

if (props.formData.account) {
  data.value.account = ref(props.formData.account)
}
const appIcon = window.config.appIcon
const title = window.config.title
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
                <h6 class="text-h6">{{ $t('loginAndResetForm.resetHeader') }} </h6>

                <v-text-field hide-details data-test-id="loginAndResetForm-emailField" density="compact"
                    class="my-5 rounded" color="info" variant="solo"
                    :disabled="!!cb || !!props.formData.email" type="email" name="email"
                    :placeholder="data.email || $t('loginAndResetForm.emailPlaceHolder')" :value="data.email"
                    @update:modelValue="res => data.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')" required />

                <v-select data-test-id="loginAndResetForm-selectAccountField" hide-details v-model="data.account"
                    density="compact" color="info" class="my-5 rounded" variant="solo" disabled
                    item-title="name" item-value="_id" :label="$t('loginAndResetForm.selectLabel')" name="account" />

                <div v-if="route.name === 'system-accounts-forgot-password-reset'">
                    <v-btn v-if="!cb" color="info" data-test-id="loginAndResetForm-submitForgotRestBtn"
                        @click="cb = true">{{ $t('loginAndResetForm.submitBtn') }}</v-btn>
                    <div v-if="cb">
                        <v-text-field hide-details data-test-id="loginAndResetForm-newPasswordField" density="compact"
                            class=" my-5 rounded" color="info" variant="solo" name="password"
                            :label="$t('loginAndResetForm.newPasswordLabel')" type="password"
                            :placeholder="data.password || $t('loginAndResetForm.newPasswordPlaceholder')"
                            :value="data.password"
                            @update:modelValue="res => data.password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                            required />
                        <v-text-field hide-details density="compact" class=" my-5 rounded"
                            color="info" variant="solo" name="confirmPassword"
                            data-test-id="loginAndResetForm-newPasswordAgainField"
                            :label="$t('loginAndResetForm.confirmNewPasswordLabel')" type="password"
                            :placeholder="data.confirmPassword || $t('loginAndResetForm.confirmNewPasswordPlaceholder')"
                            :value="data.confirmPassword"
                            @update:modelValue="res => data.confirmPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                            required />
                        <v-checkbox :label="$t('loginAndResetForm.checkboxLabel')" color="info" v-model="checkbox"
                            hide-details></v-checkbox>
                        <v-btn color="info" :disabled="!checkbox" data-test-id="loginAndResetForm-submitBtn"
                            @click="$emit('handleForgotPasswordResetHandler', data)">{{ $t('loginAndResetForm.resetBtnText') }}</v-btn>
                        <button hidden :disabled="!checkbox"
                            @click.enter.prevent="$emit('handleForgotPasswordResetHandler', data)" />
                    </div>
                </div>

                <div v-if="route.name !== 'system-accounts-forgot-password-reset'">
                    <div v-if="cb !== 'reset'">
                        <v-checkbox :label="$t('loginAndResetForm.checkboxLabel')" color="info" v-model="checkbox"
                            hide-details></v-checkbox>
                        <v-btn color="info" :disabled="!checkbox || !data.account || !data.email " data-test-id="loginAndResetForm-forgotPasswordBtn"
                            @click="processing = true; $emit('handleForgotPasswordHandler', data, (res) => { res ? cb = res : null; processing = false })">
                            {{ !processing ? $t('loginAndResetForm.resetBtnText') : '' }}
                            <v-progress-circular v-if="processing" :size="20"
                                indeterminate></v-progress-circular>{{ processing ? $t('processing') : '' }}
                        </v-btn>
                        <button hidden :disabled="!checkbox"
                        @click.enter.prevent="processing = true; $emit('handleForgotPasswordHandler', data, (res) => { res ? cb = res : null; processing = false })" />
                        <p class="mt-4 pa-4">{{ $t('loginAndResetForm.redirectToLoginMessage') }}
                        <router-link style="text-decoration: none; color: inherit;" class="font-weight-bold" to="/system-accounts-login">{{
                            $t('loginAndResetForm.redirectToLoginBtn') }}</router-link>
                    </p>
                    </div>
                    <p v-if="cb === 'reset'" data-test-id="loginAndResetForm-forgotPasswordCb" class="mt-4">
                        {{ $t('loginAndResetForm.cb.resetMessage') }}</p>
                </div>
            </v-card-text>

        </v-card>
    </v-form>
</template>
