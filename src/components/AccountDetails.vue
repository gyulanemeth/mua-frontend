<script setup >
import { ref, nextTick } from 'vue'
import ImgCropper from './ImageCropper.vue'

const componentProps = defineProps({
  name: String,
  urlFriendlyName: String,
  logo: String,
  role: Boolean
})

const emit = defineEmits(['uploadLogoHandler', 'deleteLogoHandler'])

const name = ref(componentProps.name)
const urlFriendlyName = ref(componentProps.urlFriendlyName)
const logo = ref(componentProps.logo || import.meta.env.BASE_URL + 'placeholder.jpg')
const editMode = ref()
const nameInput = ref()
const processing = ref()
const urlFriendlyNameInput = ref()
const showCropperDialog = ref(false)
const imageFile = ref(false)

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
      logo.value = url + '?' + Date.now()
    }
    processing.value = false
  })
}

const handleFileChange = (event) => {
  processing.value = true
  const reader = new FileReader()
  reader.onload = () => {
    imageFile.value = reader.result
    showCropperDialog.value = true
  }
  reader.readAsDataURL(event.target.files[0])
}

const openFileInput = () => {
  const fileInput = document.querySelector('input[type=file]')
  fileInput.click()
}

</script>

<template>
    <div class="mx-3">
    <v-layout class="d-flex flex-wrap my-n3 mx-0 pt-0 w-75">
      <v-col class="pt-3">
        <h3 class="font-weight-bold">{{ $t('accountDetails.detailsLabel') }}</h3>
        <v-divider />

        <v-row align="center" class="mt-3">
          <v-col>
            <p class="font-weight-bold">{{ $t('accountDetails.nameLabel') }}</p>
          </v-col>
          <v-text-field hide-details density="compact" data-test-id="accountDetails-nameField"
            :disabled='editMode !== "name"' color="info" variant="underlined" name="name" type="text" ref="nameInput"
            :placeholder="name || $t('accountDetails.namePlaceholder')" :value="name"
            @keydown.enter="$emit('updateNameHandler', name); editMode = false"
            @keydown.esc="editMode = false; name = componentProps.name"
            @update:modelValue="res => name = res.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '')" required />
          <template v-if='editMode === "name"'>
            <v-btn color="info" variant="text" data-test-id="accountDetails-confirmNameEditBtn" icon="mdi-check"
              size="small" @click.stop="$emit('updateNameHandler', name); editMode = false" />
            <v-btn class="ml-2" color="error" data-test-id="accountDetails-cancelmNameEditBtn" variant="text"
              icon="mdi-window-close" size="small" @click='editMode = false' />
          </template>
          <template v-else-if="componentProps.role">
            <v-btn color="info" variant="text" data-test-id="accountDetails-editNameBtn" class="ma-2"
              icon="mdi-pencil-outline" size="small" @click='editMode = "name"; setNameFocus()' />
          </template>

        </v-row>
        <v-row align="center" class="mt-3">
          <v-col>
            <p class="font-weight-bold">{{ $t('accountDetails.urlFriendlyNameLabel') }}</p>
          </v-col>
          <v-text-field hide-details data-test-id="accountDetails-urlFriendlyNameField" density="compact"
            :disabled='editMode !== "urlFriendlyName"' color="info" variant="underlined" name="urlFriendlyName"
            :placeholder="urlFriendlyName || $t('accountDetails.urlFriendlyNamePlaceholder')" :value="urlFriendlyName"
            ref="urlFriendlyNameInput"
            @keydown.enter="$emit('updateUrlFriendlyNameHandler', urlFriendlyName); editMode = false"
            @keydown.esc="editMode = false; urlFriendlyName = componentProps.urlFriendlyName"
            @update:modelValue="res => urlFriendlyName = res.replace(/[^a-z0-9/ \.,_-]/gim, '').replace(' ', '-').toLowerCase()"
            type="text" required />
          <template v-if='editMode === "urlFriendlyName"'>
            <v-btn color="info" variant="text" data-test-id="accountDetails--confirmUrlFriendlyNameEdit" icon="mdi-check"
              size="small" @click.stop="$emit('updateUrlFriendlyNameHandler', urlFriendlyName); editMode = false" />
            <v-btn class="ml-2" color="error" data-test-id="accountDetails-cancelUrlFriendlyNameEdit" variant="text"
              icon="mdi-window-close" size="small"
              @click='editMode = false; urlFriendlyName = componentProps.urlFriendlyName' />
          </template>
          <template v-else-if="componentProps.role">
            <v-btn color="info" variant="text" data-test-id="accountDetails-editUrlFriendlyNameBtn" class="ma-2"
              icon="mdi-pencil-outline" size="small" @click='editMode = "urlFriendlyName"; setUrlFriendlyNameFocus()' />
          </template>

        </v-row>
      </v-col>
      <v-col cols="4" class="pt-3">
        <h3 class="font-weight-bold">{{ $t('accountDetails.picLabel') }}</h3>
        <v-divider />
        <v-col align="center" class="mt-3">
          <v-hover v-slot="{ isHovering, props }">
            <v-progress-circular v-if="processing" :size="180" class="pa-3 ma-3" indeterminate>{{ $t('processing')
            }}</v-progress-circular>
            <v-avatar v-else v-bind="props" class="elevation-3 " size="180">
              <v-img :src="logo" class="align-self-stretch" cover />
              <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" accept=".png, .jpeg, .jpg, .gif">

              <v-expand-transition>

                <v-container v-if="isHovering && componentProps.role" class="d-flex justify-center align-end w-100 h-100 v-card--reveal">
                  <v-btn v-if="componentProps.logo" @click="handleDeleteAccountLogo" color="white" class="align-center"
                    variant="text" icon="mdi-delete-forever-outline" size="small" />
                  <v-btn v-else color="white" @click="openFileInput" variant="text" class="align-center"
                    icon="mdi-camera-plus-outline" size="small" />
                </v-container>

              </v-expand-transition>

            </v-avatar>
          </v-hover>
        </v-col>
      </v-col>
      <ImgCropper v-if="imageFile" :profilePicture="imageFile" :showCropperDialog="showCropperDialog" @uploadProfilePictureHandler="uploadlogo" @closeCropperHandler="processing = false; showCropperDialog = false" />
    </v-layout>
  </div>
</template>

<style scoped>
.v-card--reveal {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  transition: ease;
  opacity: .9;
}</style>
