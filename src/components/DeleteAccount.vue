<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'

const { t } = useI18n()
const store = useCurrentUserAndAccountStore()

const props = defineProps({
  data: Object
})

const dialog = ref(false)
const processing = ref(false)
const data = ref(props.data || {})
const logo = ref(import.meta.env.BASE_URL + 'placeholder.jpg')
const password = ref()

async function deleteAccount () {
  const res = await store.deleteAccount(password.value)
  if (res.message) {
    processing.value = false
  } else {
    useSystemMessagesStore().addSuccess({ message: t('deleteAccount.deleteAlert') })
  }
}

const show = () => {
  dialog.value = true
}

const hide = () => {
  dialog.value = false
  password.value = ''
}

defineExpose({
  dialog,
  show,
  hide
})

</script>

<template>
    <v-dialog tabindex="-1" @keydown.enter="processing = true; deleteAccount()" @keydown.esc="hide" v-model="dialog">
        <v-card width="50%" max-width="800" class="ma-auto">
        <v-container class="d-flex flex-column justify-center">
        <v-card-text>
            <v-toolbar color="white" align="center">
                <v-toolbar-title class="font-weight-bold text-error" ><div v-html="t('deleteAccount.header', {name:props.data.name})"></div></v-toolbar-title>
            </v-toolbar>
                <v-banner icon="mdi-delete-forever" color="red-lighten-4" class=" elevation-5 bg-red-lighten-5">
                    <v-banner-text  class="text-error pt-2" >
                        <div v-html="t('deleteAccount.deleteAccountMessage', {name:props.data.name})"></div>
                    </v-banner-text>
                </v-banner>
            </v-card-text>
            <v-card-text align="start">
                    <v-row align="center" class="py-10">
                            <h3 class="font-weight-bold">{{$t('deleteAccount.overviewLabel')}}</h3>
                            <v-divider />
                        </v-row>
                <v-row align="center">
                    <v-col cols="4">
                        <p class="font-weight-bold">{{ t('deleteAccount.nameLabel') }} </p>
                    </v-col>
                    <v-col cols="8" align='center'>
                        <v-text-field disabled hide-details density="compact" class="my-5 rounded" color="info" variant="solo"  v-model="data.name"/>
                    </v-col>
                    <v-col cols="4">
                        <p class="font-weight-bold">{{ t('deleteAccount.urlFriendlyName') }} </p>
                    </v-col>
                    <v-col cols="8" align='center'>
                        <v-text-field  disabled hide-details density="compact" class="my-5 rounded" color="info" variant="solo" v-model="data.urlFriendlyName"  />
                    </v-col>
                    <v-col cols="4">
                        <p class="font-weight-bold">{{ t('deleteAccount.picLabel') }}</p>
                    </v-col>
                    <v-col cols="8" align='center'>
                       <v-card  class="mx-2 my-5 pa-2" min-width="275">
                            <v-img :src="props.data.logo || logo" height="150px" ></v-img>
                            <v-card-title class="justify-center py-0">
                                <v-btn  variant="text" icon="mdi-image-plus" disabled color="grey-lighten-1" type="file"></v-btn>
                            </v-card-title>
                        </v-card>
                    </v-col>
                    <v-col>
                <v-row align="center" class="py-10">
                    <h3 class="font-weight-bold">{{$t('deleteAccount.passwordConfirmationHeader')}}</h3>
                    <v-divider />
                </v-row>

                <v-row align="center">
                    <v-col>
                        <p class="font-weight-bold">{{$t('deleteAccount.passwordLabel')}}</p>
                    </v-col>
                    <v-text-field hide-details density="compact" color="info" class="my-5 rounded" variant="solo"
                    name="password" type="password"
                    :placeholder="password || $t('deleteAccount.passwordPlaceholder')"
                    :value="password"
                    @update:modelValue="res => password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                    required />
                </v-row>
            </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" :disabled="!password"
                    @click="processing = true; deleteAccount()">
                    {{ !processing ? t('deleteAccount.deleteBtn') : '' }}
                    <v-progress-circular v-if="processing" :size="20"
                        indeterminate></v-progress-circular>{{ processing ? $t('processing') : '' }}
                </v-btn>
                <v-spacer />
                <v-btn color="info" data-test-id="formDialog-cancelBtn"
                    @click="hide">{{ t('deleteAccount.cancelBtn') }}</v-btn>
            </v-card-actions>
        </v-container>
    </v-card>
    </v-dialog>
</template>
