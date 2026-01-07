<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAccountsStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'

const { t } = useI18n()
const store = useAccountsStore()

const props = defineProps({
  data: Object
})

const dialogShown = ref(false)
const processing = ref(false)
const password = ref()

async function deleteAccount () {
  const res = await store.deleteAccount(password.value)
  if (res.message) {
    processing.value = false
  } else {
    useSystemMessagesStore().addSuccess({ message: t('mua.deleteAccount.deleteAlert') })
  }
}

const show = () => {
  dialogShown.value = true
}

const hide = () => {
  dialogShown.value = false
  password.value = ''
}

defineExpose({
  show,
  hide
})

</script>

<template>
    <v-dialog tabindex="-1" @keydown.enter="processing = true; deleteAccount()" @keydown.esc="hide"
        v-model="dialogShown">
        <v-card :width="!$vuetify.display.mdAndUp ? '100%' : '50%'" max-width="800" class="ma-auto">
            <v-container class="d-flex flex-column justify-center">
                <v-card-text>
                    <v-toolbar color="white" align="center">
                        <v-toolbar-title class="font-weight-bold text-error">
                            <div v-html="t('mua.deleteAccount.header', { name: props.data.name })"></div>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-banner icon="mdi-delete-forever" color="red-lighten-4" class=" elevation-5 bg-red-lighten-5">
                        <v-banner-text class="text-error pt-2">
                            <div v-html="t('mua.deleteAccount.deleteAccountMessage', { name: props.data.name })"></div>
                        </v-banner-text>
                    </v-banner>
                    <p class="text-body-1 font-weight-bold mt-10">{{ $t('mua.deleteAccount.passwordConfirmationHeader')
                        }}</p>
                    <v-text-field hide-details density="compact" color="primary" class="mb-5 mt-2 rounded"
                        variant="solo" name="password" type="password" prepend-inner-icon="mdi-lock"
                        :placeholder="password || $t('mua.deleteAccount.passwordPlaceholder')" :value="password"
                        @update:modelValue="res => password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')" required />
                    <div class="d-flex flex-wrap justify-end align-end">
                        <v-btn color="grey" variant="outlined" class="mr-2" data-test-id="formDialog-cancelBtn"
                            @click="hide">{{
                                t('mua.deleteAccount.cancelBtn') }}</v-btn>
                        <v-btn color="error" :disabled="!password" @click="processing = true; deleteAccount()">
                            {{ !processing ? t('mua.deleteAccount.deleteBtn') : '' }}
                            <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                                processing ? $t('mua.processing') : '' }}
                        </v-btn>
                    </div>
                </v-card-text>
            </v-container>
        </v-card>
    </v-dialog>
</template>
