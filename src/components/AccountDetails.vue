<script setup >
import { ref, nextTick } from 'vue'
import ImgCropper from './ImageCropper.vue'
import { useI18n } from 'vue-i18n'
import DeleteAccount from './DeleteAccount.vue'

const { t } = useI18n()
const componentProps = defineProps({
  name: String,
  urlFriendlyName: String,
  logo: String,
  role: Boolean
})

const emit = defineEmits(['uploadLogoHandler', 'deleteLogoHandler'])

const deleteAccountDialog = ref()
const name = ref(componentProps.name)
const urlFriendlyName = ref(componentProps.urlFriendlyName)
const logo = ref(componentProps.logo || import.meta.env.BASE_URL + 'placeholder.jpg')
const editMode = ref()
const nameInput = ref()
const processing = ref()
const urlFriendlyNameInput = ref()
const showCropperDialog = ref(false)

const setNameFocus = () => {
  nextTick(() => {
    nameInput.value.focus()
  })
}

const setUrlFriendlyNameFocus = () => {
  nextTick(() => {
    urlFriendlyNameInput.value.focus()
  })
}

const handleDeleteAccountLogo = () => {
  processing.value = true
  emit('deleteLogoHandler', (res) => {
    if (res) {
      logo.value = import.meta.env.BASE_URL + 'placeholder.jpg'
    }
    processing.value = false
  })
}

const uploadlogo = (image) => {
  showCropperDialog.value = false
  emit('uploadLogoHandler', image, (url) => {
    if (url) {
      logo.value = url
    }
    processing.value = false
  })
}

const openFileInput = () => {
  processing.value = true
  showCropperDialog.value = true
}

</script>

<template>
    <div class="mx-0 mt-4">
    <v-layout style="z-index: 10;" class="d-flex flex-wrap w-100">
      <v-col cols="12" md="8"  class="pt-3">
        <p class="text-body-1 font-weight-bold">{{ $t('mua.accountDetails.detailsLabel') }}</p>
        <v-divider />

        <v-row align="center" class="mt-3">
          <v-col>
            <p class="font-weight-bold">{{ $t('mua.accountDetails.nameLabel') }}</p>
          </v-col>
          <v-text-field hide-details density="compact" data-test-id="accountDetails-nameField"
            :disabled='editMode !== "name"' color="primary" variant="underlined" name="name" type="text" ref="nameInput"
            :placeholder="name || $t('mua.accountDetails.namePlaceholder')" :value="name"
            @keydown.enter="$emit('updateNameHandler', name); editMode = false"
            @keydown.esc="editMode = false; name = componentProps.name"
            @update:modelValue="res => name = res.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '')" required />
          <template v-if='editMode === "name"'>
            <v-btn color="primary" variant="text" data-test-id="accountDetails-confirmNameEditBtn" icon="mdi-check"
              size="small" @click.stop="$emit('updateNameHandler', name); editMode = false" />
            <v-btn class="ml-2" color="error" data-test-id="accountDetails-cancelmNameEditBtn" variant="text"
              icon="mdi-window-close" size="small" @click='editMode = false' />
          </template>
          <template v-else-if="componentProps.role">
            <v-btn color="primary" variant="text" data-test-id="accountDetails-editNameBtn" class="ma-2"
              icon="mdi-pencil-outline" size="small" @click='editMode = "name"; setNameFocus()' />
          </template>

        </v-row>
        <v-row align="center" class="mt-3">
          <v-col>
            <p class="font-weight-bold">{{ $t('mua.accountDetails.urlFriendlyNameLabel') }}</p>
          </v-col>
          <v-text-field hide-details data-test-id="accountDetails-urlFriendlyNameField" density="compact"
            :disabled='editMode !== "urlFriendlyName"' color="primary" variant="underlined" name="urlFriendlyName"
            :placeholder="urlFriendlyName || $t('mua.accountDetails.urlFriendlyNamePlaceholder')" :value="urlFriendlyName"
            ref="urlFriendlyNameInput"
            @keydown.enter="$emit('updateUrlFriendlyNameHandler', urlFriendlyName); editMode = false"
            @keydown.esc="editMode = false; urlFriendlyName = componentProps.urlFriendlyName"
            @update:modelValue="res => urlFriendlyName = res.replace(/[^a-z0-9/ \.,_-]/gim, '').replace(' ', '-').toLowerCase()"
            type="text" required />
          <template v-if='editMode === "urlFriendlyName"'>
            <v-btn color="primary" variant="text" data-test-id="accountDetails--confirmUrlFriendlyNameEdit" icon="mdi-check"
              size="small" @click.stop="$emit('updateUrlFriendlyNameHandler', urlFriendlyName); editMode = false" />
            <v-btn class="ml-2" color="error" data-test-id="accountDetails-cancelUrlFriendlyNameEdit" variant="text"
              icon="mdi-window-close" size="small"
              @click='editMode = false; urlFriendlyName = componentProps.urlFriendlyName' />
          </template>
          <template v-else-if="componentProps.role">
            <v-btn color="primary" variant="text" data-test-id="accountDetails-editUrlFriendlyNameBtn" class="ma-2"
              icon="mdi-pencil-outline" size="small" @click='editMode = "urlFriendlyName"; setUrlFriendlyNameFocus()' />
          </template>

        </v-row>
      </v-col>
      <v-col cols="12" md="4" class="pt-3">
        <p class="text-body-1 font-weight-bold">{{ $t('mua.accountDetails.picLabel') }}</p>
        <v-divider />

        <v-col align="center" class="mt-3">
          <v-hover v-slot="{ isHovering, props }">
            <v-progress-circular v-if="processing" :size="180" indeterminate>{{ $t('mua.processing')
            }}</v-progress-circular>
            <v-avatar v-else v-bind="props" class="elevation-3 " size="180">
              <v-img :src="logo + '?' + Math.random().toString(36).substring(2, 7)" class="align-self-stretch" cover />
                <div v-if="isHovering && componentProps.role"  style="position: absolute;background-color: rgba(0, 0, 0, 0.6);opacity: .9; transition: ease;" class="d-flex justify-center align-end w-100 h-100">
                  <v-btn v-if="componentProps.logo" @click="handleDeleteAccountLogo" color="white" class="align-center"
                    variant="text" icon="mdi-delete-forever-outline" size="small" />
                  <v-btn v-else color="white" @click="openFileInput" variant="text" class="align-center"
                    icon="mdi-camera-plus-outline" size="small" />
                </div>
            </v-avatar>
          </v-hover>
        </v-col>
      </v-col>

      <v-layout style="z-index: 10;" class="d-flex flex-wrap w-75" v-if="componentProps.role">
        <v-col class="pt-3">
            <p class="text-body-1 font-weight-bold text-error">{{ $t('mua.accountDetails.deleteLabel') }}</p>
            <v-divider color="error" />

                <v-banner color="error" class="text-error my-4">
                       <v-banner-text class="mt-2 text-error">
            <div v-html="t('mua.accountDetails.deleteAccountMessage')"></div>
          </v-banner-text>
            </v-banner>
            <v-btn variant="outlined" color="error" @click="deleteAccountDialog.show()">{{t('mua.deleteAccount.openBtn')}}</v-btn>
              <DeleteAccount ref="deleteAccountDialog" :data="{ name: componentProps.name,  urlFriendlyName: componentProps.urlFriendlyName,  logo: componentProps.logo}"  />
            </v-col>
        </v-layout>

      <ImgCropper v-if="showCropperDialog" @uploadProfilePictureHandler="uploadlogo" @closeCropperHandler="processing = false; showCropperDialog = false" />
    </v-layout>
  </div>
</template>
