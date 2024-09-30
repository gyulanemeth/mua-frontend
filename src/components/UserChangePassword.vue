<script setup >
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import useSystemMessagesStore from '../stores/systemMessages.js'

const route = useRoute()

const show = ref({ oldPassword: false, newPassword: false, confirmNewPassword: false })
const processing = ref(false)
const data = ref({})
const resetForm = () => {
  data.value = {
    oldPassword: null,
    newPassword: null,
    confirmNewPassword: null
  }
}

</script>

<template>
    <v-layout :class="`d-flex flex-wrap ${!$vuetify.display.mdAndUp? 'w-100':'w-75'}`">
        <v-col class="pt-3">
            <p class="text-body-1 font-weight-bold">{{ route.name !== 'accounts-addPassword' ? $t('mua.userChangePassword.header'): $t('mua.userChangePassword.setPasswordHeader')  }}</p>
            <v-divider />

            <v-row align="center" v-if="route.name !== 'accounts-addPassword'" class="mt-3">
                <v-col>
                    <p class="font-weight-bold">{{ $t('mua.userChangePassword.oldPasswordLabel') }}</p>
                </v-col>
                <v-text-field hide-details data-test-id="meDetails-changePasswordTab-oldPassword" density="compact"
                    class=" my-5  rounded" color="info" variant="solo"
                    :type="show.oldPassword ? 'text' : 'password'" name="oldPassword"
                    :placeholder="data.oldPassword || $t('mua.userChangePassword.oldPasswordPlaceholder')" :value="data.oldPassword"
                    @update:modelValue="res => data.oldPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')">
                </v-text-field>
                <v-btn color="info" variant="text" :icon="show.oldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="show.oldPassword = !show.oldPassword" />
            </v-row>

            <v-row align="center" class="mt-3">
                <v-col>
                    <p class="font-weight-bold">{{ $t('mua.userChangePassword.newPasswordLabel') }}</p>
                </v-col>
                <v-text-field hide-details data-test-id="meDetails-changePasswordTab-newPassword" density="compact"
                    class="my-5 rounded" color="info" variant="solo"
                    :type="show.newPassword ? 'text' : 'password'" name="newPassword"
                    :placeholder="data.newPassword || $t('mua.userChangePassword.newPasswordPlaceholder')" :value="data.newPassword"
                    @update:modelValue="res => data.newPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')">
                </v-text-field>
                <v-btn color="info" variant="text" :icon="show.newPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="show.newPassword = !show.newPassword" />
            </v-row>
            <v-row align="center" class="mt-3">
                <v-col>
                    <p class="font-weight-bold">{{ $t('mua.userChangePassword.confirmNewPasswordLabel') }}</p>
                </v-col>
                <v-text-field hide-details data-test-id="meDetails-changePasswordTab-newPasswordAgain" density="compact"
                    class="my-5 rounded" color="info" variant="solo"
                    :type="show.confirmNewPassword ? 'text' : 'password'" name="confirmNewPassword"
                    :placeholder="data.confirmNewPassword || $t('mua.userChangePassword.confirmNewPasswordPlaceholder')"
                    :value="data.confirmNewPassword"
                    @update:modelValue="res => data.confirmNewPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')">
                </v-text-field>
                <v-btn color="info" variant="text" :icon="show.confirmNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="show.confirmNewPassword = !show.confirmNewPassword" />

            </v-row>
            <v-btn color="info" class="mt-5" data-test-id="meDetails-changePasswordTab-submitBtn"
                @click="processing = true; $emit('updatePasswordHandler', data, (res) => { res && useSystemMessagesStore().addSuccess({message: route.name !== 'accounts-addPassword'? $t('mua.userChangePassword.updateAlert'): $t('mua.userChangePassword.addAlert') }); resetForm(); processing = false })">

                {{ !processing ? route.name !== 'accounts-addPassword' ? $t('mua.userChangePassword.submitBtn'): $t('mua.userChangePassword.submitAddPasswordBtn') : '' }}

                <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                    processing ? $t('mua.processing') : '' }}

            </v-btn>
        </v-col>
    </v-layout>
</template>
