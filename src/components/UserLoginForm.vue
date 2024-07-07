<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['handleGetLoginAccountsHandler', 'handleLoginHandler'])

const props = defineProps({
  tokenData: Object
})

const route = useRoute()
const data = ref({})
const cb = ref(false)
const processing = ref(false)

if (props.tokenData.user) {
  data.value.email = ref(props.tokenData.user.email)
}
if (props.tokenData.account) {
  data.value.account = ref(props.tokenData.account._id)
}

const appIcon = import.meta.env.VITE_APP_ICON

function submitForm () {
  if (!props.tokenData.accounts && !cb.value) {
    processing.value = true
    return emit('handleGetLoginAccountsHandler', data.value.email, (res) => { res ? cb.value = res : processing.value = false })
  }
  if (props.tokenData.accounts && cb.value) {
    processing.value = true
    emit('handleLoginHandler', data.value, () => { processing.value = false })
  }
}
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
            <v-card-text align="center" @keydown.enter="submitForm">
                <h6 class="text-h6">{{ $t('mua.userLoginAndResetForm.loginHeader') }} </h6>

                <v-text-field hide-details data-test-id="loginAndResetForm-emailField" density="compact"
                    class=" my-5 rounded" color="info" variant="solo" :disabled="!!cb || !!props.tokenData.user"
                    type="email" name="email"
                    :placeholder="data.email || $t('mua.userLoginAndResetForm.emailPlaceHolder')" :value="data.email"
                    @update:modelValue="res => data.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')" required />

                <v-select v-if="props.tokenData.accounts || props.tokenData.account"
                    data-test-id="loginAndResetForm-selectAccountField" hide-details v-model="data.account"
                    density="compact" color="info" class="my-5 rounded" variant="solo" :disabled="!!cb"
                    :items="props.tokenData.accounts" item-title="name" item-value="_id"
                    :label="$t('mua.userLoginAndResetForm.selectLabel')" name="account" />

                <div v-if="props.tokenData.accounts">
                    <v-btn v-if="!cb" :disabled="!!!data.account" data-test-id="loginAndResetForm-signInBtn"
                        color="info" @click="cb = 'signIn'">{{
                            $t('mua.userLoginAndResetForm.nextBtn') }}
                    </v-btn>
                    <div v-if="cb">
                        <v-text-field hide-details density="compact" class=" my-5 rounded" color="info" variant="solo"
                            name="password" data-test-id="loginAndResetForm-passwordField"
                            :label="$t('mua.userLoginAndResetForm.passwordLabel')" type="password"
                            :placeholder="data.password || $t('mua.userLoginAndResetForm.passwordPlaceholder')"
                            :value="data.password"
                            @update:modelValue="res => data.password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                            required />
                        <v-btn color="info" data-test-id="loginAndResetForm-loginBtn"
                            @click="processing = true; $emit('handleLoginHandler', data, () => { processing = false })">

                            {{ !processing ? $t('mua.userLoginAndResetForm.loginBtnText') : '' }}

                            <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                                processing ? $t('mua.processing') : '' }}

                        </v-btn>
                    </div>
                </div>

                <div v-if="!props.tokenData.accounts">
                    <div v-if="!cb">
                        <v-btn color="info" data-test-id="loginAndResetForm-getLoginAccountsBtn"
                            @click="processing = true; $emit('handleGetLoginAccountsHandler', data.email, (res) => { res ? cb = res : null; processing = false })">
                            {{ !processing ? $t('mua.userLoginAndResetForm.loginBtnText') : '' }}
                            <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                                processing ? $t('mua.processing') : '' }}
                        </v-btn>
                    </div>
                    <p v-else data-test-id="loginAndResetForm-getLoginAccountsCb" class="mt-4">
                        {{ $t('mua.userLoginAndResetForm.cb.loginMessage') }}</p>
                </div>

            </v-card-text>

        </v-card>

        <v-container v-if="!props.tokenData.accounts && !cb" class="w-100">
            <v-col class="text-center justify-center align-center ">
                <p style="color: #888888;"> {{ $t('mua.userLoginAndResetForm.cb.forgotMessage') }}</p>
                <router-link data-test-id="loginAndResetForm-createAccountBtn"
                    style="text-decoration: none;  color: #888888;" class="font-weight-bold"
                    to="/accounts/create-account">{{
                        $t('mua.userLoginAndResetForm.cb.forgotCbBtn') }}</router-link>
            </v-col>
        </v-container>

        <v-container v-if="props.tokenData.accounts && cb" class="w-100">
            <v-col class="text-center justify-center align-center ">

                <p style="color: #888888;">{{ $t('mua.userLoginAndResetForm.forgotHeader') }}</p>
                <router-link style="text-decoration: none; color: #888888;"
                    data-test-id="loginAndResetForm-resetPasswordBtn" class="font-weight-bold"
                    :to="`/accounts/forgot-password?token=${route.query.token}&account=${data.account}`">{{
                        $t('mua.userLoginAndResetForm.forgotBtn')
                    }}</router-link>
            </v-col>
        </v-container>

    </v-layout>
</template>
