<script setup >
import { ref, nextTick } from 'vue'
import ImgCropper from './ImageCropper.vue'
const componentProps = defineProps({
  name: String,
  email: String,
  profilePicture: String
})

const name = ref(componentProps.name)
const email = ref(componentProps.email)
const profilePicture = ref(componentProps.profilePicture || import.meta.env.BASE_URL + 'placeholder.jpg')
const processing = ref(false)
const nameInput = ref(null)
const showCropperDialog = ref(false)

const emit = defineEmits(['uploadProfilePictureHandler', 'deleteProfilePictureHandler'])

const editMode = ref()

const handleDeleteProfilePicture = () => {
  processing.value = true
  emit('deleteProfilePictureHandler', (res) => {
    if (res) {
      profilePicture.value = import.meta.env.BASE_URL + 'placeholder.jpg'
    }
    processing.value = false
  })
}

const setFocus = () => {
  nextTick(() => {
    nameInput.value.focus()
  })
}

const uploadProfilePicture = (image) => {
  showCropperDialog.value = false
  emit('uploadProfilePictureHandler', image, (url) => {
    if (url) {
      profilePicture.value = url
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
  <v-layout :class="`d-flex flex-wrap ${!$vuetify.display.mdAndUp? 'w-100':'w-75'}`">
    <v-col cols="12" md="8" class="pt-3">
      <p class="text-body-1 font-weight-bold">{{ $t('mua.adminProfile.header') }}</p>
      <v-divider />

      <v-row align="center" class="mt-3">
        <v-col>
          <p class="font-weight-bold">{{ $t('mua.adminProfile.nameLabel') }}</p>
        </v-col>

        <v-text-field ref="nameInput" hide-details density="compact" :disabled='!editMode'
          data-test-id="meDetails-meTab-nameField" color="primary" variant="underlined" name="name"
          :placeholder="name || $t('mua.adminProfile.namePlaceHolder')" :value="name"
          @keydown.enter="$emit('updateNameHandler', name); editMode = false"
          @keydown.esc="editMode = false; name = componentProps.name"
          @update:modelValue="res => name = res.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '')" type="text" required />
        <template v-if='editMode'>
          <v-btn color="primary" variant="text" icon="mdi-check" size="small"
            data-test-id="meDetails-meTab-confirmNameEditBtn"
            @click.stop="$emit('updateNameHandler', name); editMode = false" />
          <v-btn class="ml-2" color="error" variant="text" icon="mdi-window-close" size="small"
            data-test-id="meDetails-meTab-cancelNameEditBtn" @click='editMode = false; name = componentProps.name' />
        </template>
        <template v-else>
          <v-btn color="primary" variant="text" class="ma-2" icon="mdi-pencil-outline" size="small"
            data-test-id="meDetails-meTab-editNameBtn" @click='editMode = true; setFocus()' />
        </template>
      </v-row>
      <v-row align="center" class="mt-3">
        <v-col>
          <p class="font-weight-bold">{{ $t('mua.adminProfile.emailLabel') }}</p>
        </v-col>
        <v-text-field hide-details density="compact" disabled color="primary" variant="underlined"
          :placeholder="$t('mua.adminProfile.emailPlaceHolder')" name="E-mail" v-model="email" type="text" required />
        <v-btn color="primary" variant="text" icon="mdi-arrow-right" class="ma-2" size="small"
          @click.stop="$emit('changeTab', 'changeEmail')" />

      </v-row>

    </v-col>
    <v-col cols="12" md="4" class="pt-3">
      <p class="text-body-1 font-weight-bold">{{ $t('mua.adminProfile.picLabel') }}</p>
      <v-divider />
      <v-col align="center" class="mt-3">
        <v-card width="180" class="rounded-circle">
          <v-avatar  class="elevation-3 " size="180">
            <v-img :src="profilePicture + '?' + Math.random().toString(36).substring(2, 7)" class="align-self-stretch" cover />
          </v-avatar>
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <v-row v-bind="props"
                style="position: absolute; z-index: 4; width:100%; height:100%; top: 0px; left: 0px;"
                 class="justify-center ma-0 pa-0">
                <div v-if="isHovering" style="position: absolute;background-color: rgba(0, 0, 0, 0.6);opacity: .9; transition: ease;"
                class="d-flex justify-center align-end w-100 h-100">
                <v-btn v-if="componentProps.profilePicture" @click="handleDeleteProfilePicture" color="white"
                class="align-center" variant="text" icon="mdi-delete-forever-outline" size="small" />
                <v-btn v-else color="white" @click="openFileInput" variant="text" class="align-center"
                icon="mdi-camera-plus-outline" size="small" />
              </div>
            </v-row>
            </template>
          </v-hover>
        </v-card>
      </v-col>
    </v-col>
    <ImgCropper v-if="showCropperDialog"
      @uploadProfilePictureHandler="uploadProfilePicture"
      @closeCropperHandler="processing = false; showCropperDialog = false" />
  </v-layout>
</template>
