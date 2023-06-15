<script setup >
import { ref } from 'vue'
import DeleteMyAccount from './DeleteMyAccount.vue'
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import alerts from '../alerts/alert.js'

const emit = defineEmits(['deleteEventHandler'])
const props = defineProps({
  data: Object
})
function redirectDeleteHandler (data) {
  emit('deleteEventHandler', data)
}

const processing = ref(false)
const btnProcessing = ref(false)

const settings = ref({})
const alert = alerts()
const store = useCurrentUserAndAccountStore()
await store.readOne()
const defaultLogo = import.meta.env.BASE_URL + 'placeholder.jpg'
const logo = ref(store.account.logo)

const submit = async () => {
  btnProcessing.value = true
  let res
  if (settings.value.logo === null) {
    res = await store.deleteAccountLogo()
  } else if (settings.value.logo) {
    res = await store.uploadAccountLogo(settings.value.logo)
    logo.value = res.logo
  }
  if (res && !res.message) {
    alert.message('Updated Successfully')
  }
  btnProcessing.value = false
}

const removeLogo = () => {
  logo.value = import.meta.env.BASE_URL + 'placeholder.jpg'
  settings.value.logo = null
  logo.value = null
}

const handleFileChange = (event) => {
  processing.value = true
  const formData = new FormData()
  formData.append('logo', event.target.files[0])
  settings.value.logo = formData
  previewImage(event.target.files[0])
  processing.value = false
}

const openFileInput = () => {
  const fileInput = document.getElementById('accountSettingLogo')
  fileInput.click()
}

const previewImage = (file) => {
  const reader = new FileReader()
  reader.onload = () => {
    logo.value = reader.result
  }
  reader.readAsDataURL(file)
}

</script>

<template >
  <v-layout class="d-flex flex-wrap w-75">
    <v-col class="pt-3">
      <h3 class="font-weight-bold">{{ $t('adminSettings.header') }}</h3>
      <v-divider />

      <v-row align="center" class="mt-3">
        <v-col>
          <p class="font-weight-bold">{{ $t('adminSettings.picLabel') }}</p>
        </v-col>

        <v-card class="mx-2 my-5 pa-2 align-center w-50">
          <div v-if="processing" style="position: relative; height: 150px;">
            <v-progress-circular style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
              :size="120" class="pa-3 " indeterminate>
              <span>
                {{ $t('processing') }}
              </span>
            </v-progress-circular>
          </div>

          <v-img v-else :src="logo || defaultLogo" height="150px" cover></v-img>
          <input ref="fileInput" type="file" id="accountSettingLogo" style="display: none" @change="handleFileChange">

          <v-card-title class="justify-center py-0">
            <v-btn v-if="logo" @click="removeLogo" color="red" variant="text" icon="mdi-delete-forever-outline"
              size="small" />
            <v-btn v-else color="grey-lighten-1" @click="openFileInput" variant="text" icon="mdi-image-plus"
              size="small" />
          </v-card-title>
          <v-row class="justify-center py-3 ">
            <p v-if="logo">{{ $t('adminSettings.picDeleteSubmit') }}</p>
            <p v-else>{{ $t('adminSettings.picSubmit') }}</p>
          </v-row>
        </v-card>
      </v-row>
      <v-row align="center" class="mt-3">
        <v-col>
          <p class="font-weight-bold">{{ $t('adminSettings.inputLabel') }}</p>
        </v-col>
        <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info"
          variant="plain" name="example" :placeholder="$t('adminSettings.inputPlaceholder')">
        </v-text-field>
      </v-row>

      <v-btn color="info mt-3" @click="submit">
        {{ !btnProcessing ? $t('adminSettings.btnLabel') : '' }}
        <v-progress-circular v-if="btnProcessing" :size="20" class="pa-3 ma-3" indeterminate></v-progress-circular>{{
          btnProcessing ? $t('processing') : '' }}
      </v-btn>

      <v-col class="pt-15">
        <h3 class="font-weight-bold text-error">{{ $t('adminSettings.deleteLabel') }}</h3>
        <v-divider color="error" />

        <DeleteMyAccount @deleteEventHandler="redirectDeleteHandler" :data="props.data" />
      </v-col>
    </v-col>

  </v-layout>
</template>
