<script setup >
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  formData: Object,
  tokenData: Object
})

const route = useRoute()

const data = ref({})
const cb = ref(false)
const processing = ref(false)
const checkbox = ref()

if (props.tokenData.user) {
  data.value.email = ref(props.tokenData.user.email)
}
if (props.tokenData.account) {
  data.value.account = ref(props.tokenData.account._id)
}

const appIcon = window.config.appIcon
const title = window.config.title

</script>

<template>
    <v-form class="d-flex flex-column justify-center align-center h-screen">
        <v-card elevation="0" class="w-25">
            <v-card-text align="center">
                <v-avatar size="80">
                    <v-img :src="appIcon" cover></v-img>
                </v-avatar>
            </v-card-text>
            <v-card-title class="justify-center py-0">
                <h4 class="text-h4"> {{ title }} </h4>
            </v-card-title>
        </v-card>
        <v-card class="ma-2 pa-2  rounded-xl  elevation-2" width="30%">
            <v-card-text align="center">
                <h6 class="text-h6">{{ props.formData.header }}</h6>
                <v-text-field hide-details data-test-id="loginAndResetForm-emailField" density="compact"
                    class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain"
                    :disabled="!!cb || !!props.tokenData.user" type="email" name="email"
                    :placeholder="data.email || $t('loginAndResetForm.emailPlaceHolder')" :value="data.email"
                    @update:modelValue="res => data.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')" required />
                <v-select v-if="props.tokenData.accounts || props.tokenData.account"
                    data-test-id="loginAndResetForm-selectAccountField" hide-details v-model="data.account"
                    density="compact" color="info" class="elevation-2 my-5 pt-2 pl-3 rounded" variant="plain"
                    :disabled="!!cb" :items="props.tokenData.accounts" item-title="name" item-value="_id"
                    :label="$t('loginAndResetForm.selectLabel')" name="account" />

                <div v-if="props.tokenData.accounts && props.formData.btnText === $t('loginAndResetForm.loginBtnText')">
                    <v-btn v-if="!cb" data-test-id="loginAndResetForm-signInBtn" color="info" @click="cb = 'signIn'">{{
                        $t('loginAndResetForm.nextBtn') }}
                    </v-btn>
                    <div v-if="cb">
                        <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded"
                            color="info" variant="plain" name="password" data-test-id="loginAndResetForm-passwordField"
                            :label="$t('loginAndResetForm.passwordLabel')" type="password"
                            :placeholder="data.password || $t('loginAndResetForm.passwordPlaceholder')"
                            :value="data.password"
                            @update:modelValue="res => data.password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                            required />
                        <p class="mt-4 pa-4">{{ $t('loginAndResetForm.forgotHeader') }}
                            <router-link style="text-decoration: none; color: inherit;"
                                data-test-id="loginAndResetForm-resetPasswordBtn" class="font-weight-bold"
                                :to="`/forgot-password?token=${route.query.token}`">{{ $t('loginAndResetForm.forgotBtn')
                                }}</router-link>
                        </p>
                        <v-btn color="info" data-test-id="loginAndResetForm-loginBtn"
                            @click="processing = true; $emit('handleLoginHandler', data, () => { processing = false })">

                            {{ !processing ? props.formData.btnText : '' }}

                            <v-progress-circular v-if="processing" :size="20" class="pa-3 ma-3"
                                indeterminate></v-progress-circular>{{ processing ? $t('processing') : '' }}

                        </v-btn>
                        <button hidden
                            @click.enter.prevent="processing = true; $emit('handleLoginHandler', data, () => { processing = false })" />
                    </div>
                </div>

                <div v-if="props.tokenData.account">
                    <v-btn v-if="!cb" color="info" data-test-id="loginAndResetForm-submitForgotRestBtn"
                        @click="cb = true">{{ $t('loginAndResetForm.submitBtn') }}</v-btn>
                    <div v-if="cb">
                        <v-text-field hide-details data-test-id="loginAndResetForm-newPasswordField" density="compact"
                            class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" name="password"
                            :label="$t('loginAndResetForm.newPasswordLabel')" type="password"
                            :placeholder="data.password || $t('loginAndResetForm.newPasswordPlaceholder')"
                            :value="data.password"
                            @update:modelValue="res => data.password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                            required />
                        <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded"
                            color="info" variant="plain" name="confirmPassword"
                            data-test-id="loginAndResetForm-newPasswordAgainField"
                            :label="$t('loginAndResetForm.confirmNewPasswordLabel')" type="password"
                            :placeholder="data.confirmPassword || $t('loginAndResetForm.confirmNewPasswordPlaceholder')"
                            :value="data.confirmPassword"
                            @update:modelValue="res => data.confirmPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                            required />
                        <v-checkbox :label="$t('loginAndResetForm.checkboxLabel')" color="info" v-model="checkbox"
                            hide-details></v-checkbox>
                        <v-btn color="info" :disabled="!checkbox" data-test-id="loginAndResetForm-submitBtn"
                            @click="$emit('handleForgotPasswordResetHandler', data)">{{ props.formData.btnText }}</v-btn>
                        <button hidden :disabled="!checkbox" @click.enter.prevent="$emit('handleForgotPasswordResetHandler', data)" />
                    </div>
                </div>

                <div
                    v-if="props.tokenData.accounts && !props.tokenData.account && props.formData.btnText === $t('loginAndResetForm.resetBtnText')">
                    <div v-if="cb !== 'reset'">
                        <v-checkbox :label="$t('loginAndResetForm.checkboxLabel')" color="info" v-model="checkbox"
                            hide-details></v-checkbox>
                        <v-btn color="info" :disabled="!checkbox" data-test-id="loginAndResetForm-forgotPasswordBtn"
                            @click="processing = true; $emit('handleForgotPasswordHandler', data, (res) => { res? cb = res: null; processing = false })">
                            {{ !processing ? props.formData.btnText : '' }}
                            <v-progress-circular v-if="processing" :size="20" class="pa-3 ma-3"
                                indeterminate></v-progress-circular>{{ processing ? $t('processing') : '' }}
                        </v-btn>
                        <button hidden :disabled="!checkbox"
                            @click.enter.prevent="processing = true; $emit('handleForgotPasswordHandler', data, (res) => { res? cb = res: null; processing = false })" />
                    </div>
                    <p v-if="cb === 'reset'" data-test-id="loginAndResetForm-forgotPasswordCb" class="mt-4">
                        {{ $t('loginAndResetForm.cb.resetMessage') }}</p>
                </div>

                <div v-if="!props.tokenData.accounts">
                    <div v-if="!cb">
                        <v-btn color="info" :disabled="!checkbox" data-test-id="loginAndResetForm-getLoginAccountsBtn"
                            @click="processing = true; $emit('handleGetLoginAccountsHandler', data.email, (res) => { res ? cb = res : null; processing = false })">
                            {{ !processing ? props.formData.btnText : '' }}
                            <v-progress-circular v-if="processing" :size="20" class="pa-3 ma-3"
                                indeterminate></v-progress-circular>{{ processing ? $t('processing') : '' }}
                        </v-btn>
                        <p class="mt-4 pa-4">
                            {{ $t('loginAndResetForm.cb.forgotMessage') }}
                            <router-link data-test-id="loginAndResetForm-createAccountBtn"
                                style="text-decoration: none;  color: inherit;" class="font-weight-bold"
                                to="/create-account">{{ $t('loginAndResetForm.cb.forgotCbBtn') }}</router-link>
                        </p>
                    </div>
                    <p v-else data-test-id="loginAndResetForm-getLoginAccountsCb" class="mt-4">
                        {{ $t('loginAndResetForm.cb.loginMessage') }}</p>
                    <button hidden :disabled="!checkbox"
                        @click.enter.prevent="$emit('handleGetLoginAccountsHandler', data.email, (res) => { res? cb = res: null; })" />
                </div>

            </v-card-text>

        </v-card>
    </v-form>
</template>
