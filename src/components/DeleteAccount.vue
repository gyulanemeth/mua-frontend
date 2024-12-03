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
const data = ref(props.data || {})
const logo = ref(import.meta.env.BASE_URL + 'placeholder.jpg')
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
    <v-dialog tabindex="-1" @keydown.enter="processing = true; deleteAccount()" @keydown.esc="hide" v-model="dialogShown">
        <v-card :width="!$vuetify.display.mdAndUp? '100%': '50%'" max-width="800" class="ma-auto">
        <v-container class="d-flex flex-column justify-center">
        <v-card-text>
            <v-toolbar color="white" align="center">
                <v-toolbar-title class="font-weight-bold text-error" ><div v-html="t('mua.deleteAccount.header', {name:props.data.name})"></div></v-toolbar-title>
            </v-toolbar>
                <v-banner icon="mdi-delete-forever" color="red-lighten-4" class=" elevation-5 bg-red-lighten-5">
                    <v-banner-text  class="text-error pt-2" >
                        <div v-html="t('mua.deleteAccount.deleteAccountMessage', {name:props.data.name})"></div>
                    </v-banner-text>
                </v-banner>
            </v-card-text>
            <v-card-text align="start">
                    <v-row align="center" class="py-10">
                            <p class="text-body-1 font-weight-bold">{{$t('mua.deleteAccount.overviewLabel')}}</p>
                            <v-divider />
                        </v-row>
                <v-row align="center">
                    <v-col cols="4">
                        <p class="font-weight-bold">{{ t('mua.deleteAccount.nameLabel') }} </p>
                    </v-col>
                    <v-col cols="8" align='center'>
                        <v-text-field disabled hide-details density="compact" class="my-5 rounded" color="info" variant="solo"  v-model="data.name"/>
                    </v-col>
                    <v-col cols="4">
                        <p class="font-weight-bold">{{ t('mua.deleteAccount.urlFriendlyName') }} </p>
                    </v-col>
                    <v-col cols="8" align='center'>
                        <v-text-field  disabled hide-details density="compact" class="my-5 rounded" color="info" variant="solo" v-model="data.urlFriendlyName"  />
                    </v-col>
                    <v-col cols="12" md="4">
                        <p class="font-weight-bold">{{ t('mua.deleteAccount.picLabel') }}</p>
                    </v-col>
                    <v-col cols="12" md="8" align='center'>
                       <v-card  class="mx-2 my-5 pa-2" min-width="275">
                            <v-img :src="props.data.logo || logo" height="150px" ></v-img>
                            <v-card-title class="justify-center py-0">
                                <v-btn  variant="text" icon="mdi-image-plus" disabled color="grey-lighten-1" type="file"></v-btn>
                            </v-card-title>
                        </v-card>
                    </v-col>
                    <v-col>
                <v-row align="center" class="py-10">
                    <p class="text-body-1 font-weight-bold">{{$t('mua.deleteAccount.passwordConfirmationHeader')}}</p>
                    <v-divider />
                </v-row>

                <v-row align="center">
                    <v-col>
                        <p class="font-weight-bold">{{$t('mua.deleteAccount.passwordLabel')}}</p>
                    </v-col>
                    <v-text-field hide-details density="compact" color="info" class="my-5 rounded" variant="solo"
                    name="password" type="password"
                    :placeholder="password || $t('mua.deleteAccount.passwordPlaceholder')"
                    :value="password"
                    @update:modelValue="res => password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                    required />
                </v-row>
            </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn color="info" data-test-id="formDialog-cancelBtn"
                    @click="hide">{{ t('mua.deleteAccount.cancelBtn') }}</v-btn>
                    <v-spacer />
                <v-btn color="error" :disabled="!password"
                    @click="processing = true; deleteAccount()">
                    {{ !processing ? t('mua.deleteAccount.deleteBtn') : '' }}
                    <v-progress-circular v-if="processing" :size="20"
                        indeterminate></v-progress-circular>{{ processing ? $t('mua.processing') : '' }}
                </v-btn>
            </v-card-actions>
        </v-container>
    </v-card>
    </v-dialog>
</template>
