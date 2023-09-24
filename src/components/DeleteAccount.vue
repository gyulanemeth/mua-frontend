<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import alerts from '../alerts/alert.js'

const { t } = useI18n()
const store = useCurrentUserAndAccountStore()

const props = defineProps({
  data: Object
})

const dialog = ref(false)
const processing = ref(false)
const data = ref(props.data || {})
const logo = ref(import.meta.env.BASE_URL + 'placeholder.jpg')
const alert = alerts()

async function deleteAccount () {
  const res = await store.deleteAccount()
  if (res.message) {
    processing.value = false
  } else {
    await alert.message(t('deleteAccount.deleteAlert'))
  }
}

</script>

<template>
    <v-dialog v-model="dialog" persistent>
        <template v-slot:activator="{ props }">
            <v-btn variant="outlined" color="error" v-bind="props">
                {{t('deleteAccount.openBtn')}}
            </v-btn>
        </template>
        <v-card>
        <v-container min-width="800" class="d-flex flex-column justify-center">
        <v-card-text>
            <v-toolbar color="white" align="center">
                <v-toolbar-title class="font-weight-bold">{{t('deleteAccount.header')}}</v-toolbar-title>
            </v-toolbar>
                <v-banner icon="mdi-delete-forever" color="red-lighten-4" class="my-10 elevation-5 bg-red-lighten-5">
                    <v-banner-text  class="text-error pt-2" >
                        <div v-html="t('deleteAccount.deleteAccountMessage', {name:props.data.name})"></div>
                    </v-banner-text>
                </v-banner>
            </v-card-text>
                <v-card-text align="start">
                <v-row align="center">
                    <v-col cols="4">
                        <p class="font-weight-bold">{{ t('deleteAccount.nameLabel') }} </p>
                    </v-col>
                    <v-col cols="8" align='center'>
                        <v-text-field disabled hide-details density="compact" class=" elevation-2 my-5 pl-3 rounded" color="info" variant="plain"  v-model="data.name"/>
                    </v-col>
                    <v-col cols="4">
                        <p class="font-weight-bold">{{ t('deleteAccount.urlFriendlyName') }} </p>
                    </v-col>
                    <v-col cols="8" align='center'>
                        <v-text-field  disabled hide-details density="compact" class=" elevation-2 my-5 pl-3 rounded" color="info" variant="plain" v-model="data.urlFriendlyName"  />
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
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn color="error"
                    @click="processing = true; deleteAccount()">
                    {{ !processing ? t('deleteAccount.deleteBtn') : '' }}
                    <v-progress-circular v-if="processing" :size="20" class="pa-3 ma-3"
                        indeterminate></v-progress-circular>{{ processing ? $t('processing') : '' }}
                </v-btn>
                <v-btn color="info" data-test-id="formDialog-cancelBtn"
                    @click="dialog = false;">{{ t('deleteAccount.cancelBtn') }}</v-btn>
            </v-card-actions>
        </v-container>
    </v-card>
    </v-dialog>
</template>
