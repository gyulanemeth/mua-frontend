<script setup >
import { ref } from 'vue'
import useSystemMessagesStore from '../stores/systemMessages.js'

const show = ref({ oldPassword: false, newPassword: false, confirmNewPassword: false })
const data = ref({})
const processing = ref(false)

const resetForm = () => {
  data.value = {
    oldPassword: null,
    newPassword: null,
    confirmNewPassword: null
  }
}

</script>

<template>
    <v-layout style="z-index: 10;" :class="`d-flex flex-wrap ${!$vuetify.display.mdAndUp? 'w-100':'w-75'}`">
        <v-col class="pt-3">
            <p class="text-body-1 font-weight-bold">{{ $t('mua.adminChangePassword.header') }}</p>
            <v-divider />

            <v-row align="center" class="mt-3">
                <v-col>
                    <p class="font-weight-bold">{{ $t('mua.adminChangePassword.oldPasswordLabel') }}</p>
                </v-col>
                <v-text-field hide-details density="compact" data-test-id="meDetails-changePasswordTab-oldPassword"
                    class="my-5 rounded" color="primary" variant="solo"
                    :type="show.oldPassword ? 'text' : 'password'" name="oldPassword"
                    :placeholder="data.oldPassword || $t('mua.adminChangePassword.oldPasswordPlaceholder')" :value="data.oldPassword"
                    @update:modelValue="res => data.oldPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')">
                </v-text-field>
                <v-btn color="primary" variant="text" :icon="show.oldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="show.oldPassword = !show.oldPassword" />
            </v-row>

            <v-row align="center" class="mt-3">
                <v-col>
                    <p class="font-weight-bold">{{ $t('mua.adminChangePassword.newPasswordLabel') }}</p>
                </v-col>
                <v-text-field hide-details density="compact" data-test-id="meDetails-changePasswordTab-newPassword"
                    class="my-5 rounded" color="primary" variant="solo"
                    :type="show.newPassword ? 'text' : 'password'" name="newPassword"
                    :placeholder="data.newPassword || $t('mua.adminChangePassword.newPasswordPlaceholder')" :value="data.newPassword"
                    @update:modelValue="res => data.newPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')">
                </v-text-field>
                <v-btn color="primary" variant="text" :icon="show.newPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="show.newPassword = !show.newPassword" />
            </v-row>
            <v-row align="center" class="mt-3">
                <v-col>
                    <p class="font-weight-bold">{{ $t('mua.adminChangePassword.confirmNewPasswordLabel') }}</p>
                </v-col>
                <v-text-field hide-details density="compact" data-test-id="meDetails-changePasswordTab-newPasswordAgain"
                    class=" my-5 rounded" color="primary" variant="solo"
                    :type="show.confirmNewPassword ? 'text' : 'password'" name="confirmNewPassword"
                    :placeholder="data.confirmNewPassword || $t('mua.adminChangePassword.confirmNewPasswordPlaceholder')"
                    :value="data.confirmNewPassword"
                    @update:modelValue="res => data.confirmNewPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')">
                </v-text-field>
                <v-btn color="primary" variant="text" :icon="show.confirmNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="show.confirmNewPassword = !show.confirmNewPassword" />

            </v-row>
            <v-btn color="primary" class="mt-5" data-test-id="meDetails-changePasswordTab-submitBtn"
                @click="processing = true; $emit('updatePasswordHandler', data, (res) => { res && useSystemMessagesStore().addSuccess({message: $t('mua.adminChangePassword.successAlert')}); resetForm(); processing = false })">

                {{ !processing ? $t('mua.adminChangePassword.submitBtn') : '' }}

                <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                    processing ? $t('mua.processing') : '' }}

            </v-btn>
        </v-col>
    </v-layout>
</template>
