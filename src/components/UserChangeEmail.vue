<script setup >
import { ref } from 'vue'
import useSystemMessagesStore from '../stores/systemMessages.js'

const props = defineProps({
  email: String
})

const processing = ref(false)
const data = ref({
  email: props.email
})

const resetForm = () => {
  data.value = {
    email: props.email,
    newEmail: null,
    confirmNewEmail: null
  }
}

</script>

<template>
    <v-layout class="d-flex flex-wrap w-75">
        <v-col class="pt-3">
            <h3 class="font-weight-bold">{{ $t('mua.userChangeEmail.header') }}</h3>
            <v-divider />

            <v-row align="center" class="mt-3">
                <v-col>
                    <p class="font-weight-bold">{{ $t('mua.userChangeEmail.currentEmailLabel') }}</p>
                </v-col>

                <v-text-field hide-details density="compact" class=" my-5 rounded" variant="solo"
                    name="currentEmail" v-model="data.email" disabled>
                </v-text-field>
            </v-row>

            <v-row align="center" class="mt-3">
                <v-col>
                    <p class="font-weight-bold">{{ $t('mua.userChangeEmail.newEmailLabel') }}</p>
                </v-col>
                <v-text-field hide-details data-test-id="meDetails-changeEmailTab-newEmail" density="compact"
                    class=" my-5  rounded" color="info" variant="solo" name="newEmail"
                    :placeholder="data.newEmail || $t('mua.userChangeEmail.newEmailPlaceHolder')" :value="data.newEmail"
                    @update:modelValue="res => data.newEmail = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')">
                </v-text-field>
            </v-row>
            <v-row align="center" class="mt-3">
                <v-col>
                    <p class="font-weight-bold">{{ $t('mua.userChangeEmail.confirmEmailLabel') }}</p>
                </v-col>
                <v-text-field hide-details data-test-id="meDetails-changeEmailTab-newEmailAgain" density="compact"
                    class=" my-5 rounded" color="info" variant="solo" name="confirmNewEmail"
                    :placeholder="data.confirmNewEmail || $t('mua.userChangeEmail.confirmEmailPlaceHolder')"
                    :value="data.confirmNewEmail"
                    @update:modelValue="res => data.confirmNewEmail = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')">
                </v-text-field>

            </v-row>
            <v-btn color="info mt-3" data-test-id="meDetails-changeEmailTab-submitBtn"
                @click="processing = true; $emit('updateEmailHandler', data, (res) => { res && useSystemMessagesStore().addSuccess({name: $t('mua.userChangeEmail.cb.message'), message: $t('mua.userChangeEmail.cb.header') });resetForm(); processing = false })">
                {{ !processing ? $t('mua.userChangeEmail.submitBtn') : '' }}

                <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                    processing ? $t('mua.processing') : '' }}
            </v-btn>
        </v-col>
    </v-layout>
</template>
