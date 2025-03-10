<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ImgCropper from './ImageCropper.vue'

const { tm } = useI18n()

const props = defineProps({
  name: String,
  header: String,
  inputs: Array,
  btnTitle: String
})

const route = useRoute()
const operation = computed(() => route.name === 'system-admins' ? tm('mua.adminCreateDialog.operation.admins') : tm('mua.adminCreateDialog.operation.accounts'))

const dialogShown = ref(false)
const processing = ref(false)
const data = ref({})
const cb = ref()
const logo = ref(import.meta.env.BASE_URL + 'placeholder.jpg')
const previewUrl = ref(null)
const showCropperDialog = ref(false)

const show = () => {
  dialogShown.value = true
}

const resetForm = () => {
  Object.keys(data.value).forEach(key => {
    data.value[key] = null
  })
  previewUrl.value = null
}

const openFileInput = () => {
  showCropperDialog.value = true
}

const previewImage = (file) => {
  data.value.logo = file
  showCropperDialog.value = false
  const reader = new FileReader()
  reader.onload = () => {
    previewUrl.value = reader.result
  }
  reader.readAsDataURL(file)
}

defineExpose({
  show,
  hide: resetForm
})
</script>

<template>
    <v-dialog v-model="dialogShown" scrollable style="z-index: 1500;" @keydown.esc="resetForm" @keydown.enter="processing = true; $emit('inviteEventHandler', data, (res) => { if(res){ cb = res} processing = false; resetForm() })" >

        <v-card :width="!$vuetify.display.mdAndUp? '100%': '50%'" max-width="800" class=" ma-auto d-flex flex-column justify-center">
            <v-toolbar color="white" align="center">
                <v-toolbar-title class="font-weight-bold">{{ props.header }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text align="start">
                <v-row align="center" v-for="(input, i) in props.inputs" :key="i">
                    <v-col cols="12" md="4">
                        <p class="font-weight-bold">{{ input.label }}</p>
                    </v-col>
                    <v-col cols="12" md="8" align='center'>
                        <v-card v-if="input.type === 'file'" class="mx-2 my-5 pa-2" min-width="275">
                            <v-img :src="previewUrl || logo" height="150px" ></v-img>
                            <v-card-title class="justify-center py-0">
                                <v-btn @click="openFileInput" variant="text" icon="mdi-image-plus"
                                    :data-test-id="`formDialog-field-${i}`" color="grey-lighten-1" type="file"></v-btn>
                            </v-card-title>
                            <p>{{ input.placeholder }}</p>
                        </v-card>
                        <v-text-field v-else hide-details density="compact" :data-test-id="`formDialog-field-${i}`"
                            class=" my-5 rounded" color="primary" variant="solo"
                            :placeholder="input.placeholder" :name="input.name" v-model="data[input.name]"
                            :type="input.type" required />
                    </v-col>
                </v-row>
                <v-row v-if="cb" data-test-id="formDialog-cb" class="justify-center">
                    <p class="font-weight-bold">{{ $t('mua.adminCreateDialog.cb.message') }}</p>
                </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" data-test-id="formDialog-cancelBtn"
                  @click="dialogShown = false; cb = undefined; resetForm()">{{ $t('mua.adminCreateDialog.cb.closeBtn') }}</v-btn>
                <v-btn color="primary" v-if="operation === $t('mua.adminCreateDialog.operation.accounts')"
                    data-test-id="formDialog-submitBtn"
                    @click="processing = true; $emit('createEventHandler', data, () => { processing = false; dialogShown = false }); resetForm()">

                    {{ !processing ? operation : '' }}

                    <v-progress-circular v-if="processing" :size="20"
                        indeterminate></v-progress-circular>{{ processing ? $t('mua.processing') : '' }}

                </v-btn>
                <v-btn color="primary" v-else-if="cb" data-test-id="formDialog-resetBtn" @click="cb = null">{{
                    $t('mua.adminCreateDialog.cb.resetbtn') }}</v-btn>
                <v-btn color="primary" v-else data-test-id="formDialog-inviteAnotherBtn"
                    @click="processing = true; $emit('inviteEventHandler', data, (res) => { if(res){ cb = res} processing = false; resetForm() })">
                    {{ !processing ? operation : '' }}
                    <v-progress-circular v-if="processing" :size="20"
                        indeterminate></v-progress-circular>{{ processing ? $t('mua.processing') : '' }}

                </v-btn>
            </v-card-actions>
        </v-card>
        <ImgCropper v-if="showCropperDialog" @uploadProfilePictureHandler="previewImage" @closeCropperHandler="processing = false; showCropperDialog = false" />

    </v-dialog>
</template>
