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

<v-layout style="z-index: 10;" :class="`d-flex flex-wrap ${!$vuetify.display.mdAndUp? 'w-100':'w-75'}`">
    <v-col class="pt-3">
        <p class="text-body-1 font-weight-bold"> {{$t('mua.adminChangeEmail.header')}}</p>
        <v-divider />

        <v-row align="center" class="mt-3">
            <v-col>
                <p class="font-weight-bold"> {{$t('mua.adminChangeEmail.currentEmailLabel')}}</p>
            </v-col>

            <v-text-field hide-details density="compact" class="my-5 rounded" variant="solo" name="currentEmail" v-model="data.email" disabled>
            </v-text-field>
        </v-row>

        <v-row align="center" class="mt-3">
            <v-col>
                <p class="font-weight-bold">{{$t('mua.adminChangeEmail.newEmailLabel')}}</p>
            </v-col>
            <v-text-field hide-details density="compact" data-test-id="meDetails-changeEmailTab-newEmail" class="my-5 rounded" color="primary" variant="solo" name="newEmail"
            :placeholder="data.newEmail || $t('mua.adminChangeEmail.newEmailPlaceHolder')"
            :value="data.newEmail"
            @update:modelValue="res => data.newEmail = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
            >
            </v-text-field>
        </v-row>
        <v-row align="center" class="mt-3">
            <v-col>
                <p class="font-weight-bold">{{$t('mua.adminChangeEmail.confirmEmailLabel')}}</p>
            </v-col>
            <v-text-field hide-details density="compact" data-test-id="meDetails-changeEmailTab-newEmailAgain" class="my-5 rounded" color="primary" variant="solo" name="confirmNewEmail"
            :placeholder="data.confirmNewEmail || $t('mua.adminChangeEmail.confirmEmailPlaceHolder')"
            :value="data.confirmNewEmail"
            @update:modelValue="res => data.confirmNewEmail = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
            >
            </v-text-field>

        </v-row>
        <v-btn color="primary" class="mt-5" data-test-id="meDetails-changeEmailTab-submitBtn" @click="processing = true; $emit('updateEmailHandler',data, (res) => {res &&  useSystemMessagesStore().addSuccess({name: $t('mua.adminChangeEmail.cb.message'), message: $t('mua.adminChangeEmail.cb.header') }); resetForm(); processing= false})">
             {{!processing? $t('mua.adminChangeEmail.submitBtn'):''}}

                   <v-progress-circular v-if="processing" :size="20" class="pa-3 ma-3"
       indeterminate
     ></v-progress-circular>{{processing? $t('mua.processing'):''}}

            </v-btn>
    </v-col>
</v-layout>

</template>
