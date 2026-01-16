<script setup>
import { ref } from 'vue'
import { useUsersStore, useAdminsStore } from '../stores/index.js'

const props = defineProps({
  systemAdmin: Boolean
})

const userStore = props.systemAdmin ? useAdminsStore() : useUsersStore()

const code = ref('')
const qrCode = ref()
const secret = ref()
const recoverySecret = ref()
const dialog = ref(false)

async function getCode () {
  const res = await userStore.getMFA()
  if (res.qrcode) {
    qrCode.value = res.qrcode
    secret.value = res.secret
  } else if (res.recoverySecret) {
    recoverySecret.value = res.recoverySecret
  }
}

const disableMFA = async () => {
  const res = await userStore.disableMFA()
  if (res.enabled === false) {
    await userStore.readOne()
    getCode()
  }
}

const onSubmit = async () => {
  const res = await userStore.confirmMFA(code.value)
  if (res.enabled) {
    await userStore.readOne()
    recoverySecret.value = res.recoverySecret
    code.value = ''
  }
}

getCode()
</script>
<template>
    <div class="d-flex flex-wrap mx-0 my-3 align-center justify-center">
        <v-card elevation="0" rounded="lg" class=" w-100">
            <p class="text-body-1 font-weight-bold ">Two Factor Authentication <span
                    v-if="userStore.user.twoFactorEnabled" class="font-weight-medium text-primary">(is enabled in your
                    account)</span></p>
            <v-divider />
            <div v-if="!userStore.user.twoFactorEnabled" class="d-flex flex-wrap ma-0 align-center justify-center">
                <v-col cols="12" md="6">
                    <div class="d-flex flex-column">
                        <p class="my-2">1. Select <span style="font-weight:600;">Add account</span> in your preferred authenticator app.</p>
                        <p class="my-2">2. Scan the QR code or paste the secret into the authenticator app.</p>
                        <p class="my-2">3. Enter the code from the authenticator app into the input field.</p>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="w-100 d-flex flex-column align-center justify-center">
                        <div
                            style="width: 210px; height: 210px; border: 1px solid #eee;border-radius: 10px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#fff;">
                            <v-img v-if="qrCode" :src="qrCode" width="210" height="210" cover alt="2FA QR" />
                            <div v-else style="color:#9aa3af; font-size: 13px;">
                                QR goes here
                            </div>
                        </div>
                        <p class="mt-4"> Or</p>
                        <div class="mt-4 align-center">
                            Enter secret into app:
                            <span class="text-grey-darken-1 font-weight-bold mt-2" style="user-select: all;">
                                {{ secret }}
                            </span>
                        </div>
                        <div class="mt-10 w-100" style="max-width: 360px;">
                            <p>Enter the code (6 digits) from the authenticator app:</p>
                            <v-text-field v-model="code" variant="outlined" density="comfortable" placeholder="Code"
                                hide-details @keydown.enter.prevent="onSubmit" style="width: 100%;" />
                            <v-btn block class="mt-3" size="large" color="primary" style="text-transform: uppercase;"
                                @click="onSubmit">
                                Submit
                            </v-btn>
                        </div>
                    </div>
                </v-col>
            </div>
            <div v-else class="d-flex flex-wrap mx-0 mb-5 align-center justify-start w-100">
                <div class="my-2 d-flex flex-wrap align-center w-100">
                    <p class="font-weight-bold w-100 mt-5"> Recovery </p>
                    <v-col cols="12" class="ma-0 pa-0" md="6">
                        <p> If your authenticator app or device is no longer available, you can reset your 2FA settings
                            with
                            the recovery code. </p>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0" md="6">
                        <v-btn color="primary" size="small" @click="dialog = true">
                            SHOW CODE
                        </v-btn>
                    </v-col>
                </div>
                <div class="my-2 d-flex flex-wrap align-center w-100">
                    <p class="font-weight-bold w-100 mt-5"> Disable 2FA </p>
                    <v-col cols="12" class="ma-0 pa-0" md="6">
                        <p> If you want to use single factor authentication, press disable. You can re-enable 2FA at any
                            time.</p>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0" md="6">
                        <v-btn @click="disableMFA" color="error" size="small">
                            DISABLE
                        </v-btn>
                    </v-col>
                </div>
            </div>
        </v-card>

        <v-dialog v-model="dialog" max-width="520">
            <v-card rounded="lg" class="overflow-hidden">
                <v-toolbar color="orange-darken-2" density="comfortable" flat>
                    <v-toolbar-title class="text-white font-weight-bold">
                        2FA recovery
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pt-6">
                    <p class="text-body-2 text-medium-emphasis mb-6">
                        2FA recovery code is used to recover your account by disabling 2FA when your 2FA
                        application is no longer available due to device error or any other accident.
                    </p>

                    <p class="text-caption text-medium-emphasis mb-2">
                        Please store this key securely.
                    </p>

                    <p class="text-center mb-2 border pa-5">
                        {{ recoverySecret }}
                    </p>
                </v-card-text>
                <v-card-actions class="px-4 pb-4">
                    <v-spacer />
                    <v-btn variant="text" class="text-none" @click="dialog = false">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
