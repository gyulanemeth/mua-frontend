<script setup>
import { ref } from 'vue'

const emit = defineEmits(['ok-button-pressed', 'cancel-button-pressed'])
const props = defineProps({
  title: String,
  body: String,
  icon: String,
  iconColor: String,
  okBtnLabel: { type: String, default: 'Yes' },
  okBtnColor: String,
  cancelBtnLabel: { type: String, default: 'Cancel' },
  cancelBtnColor: String,
  dataTestId: String
})

const showDialog = ref(false)
const data = ref()

const show = (params) => {
  data.value = params
  showDialog.value = true
}

const hide = () => {
  showDialog.value = false
  data.value = false
}

const ok = () => {
  emit('ok-button-pressed', data.value)
  hide()
}

const cancel = () => {
  emit('cancel-button-pressed')
  hide()
}

defineExpose({
  showDialog,
  show,
  hide,
  ok,
  cancel
})
</script>

<template>
  <v-dialog v-model="showDialog" persistent @keydown.enter="ok" @keydown.esc="cancel" tabindex="0"
    >
    <v-card flat width="100%" max-width="600" class=" ma-auto pa-5">
      <v-card-text class="py-5 text-center">
        <v-row>
          <v-col>
            <div class="tick-icon">
              <v-icon size="150" :color="props.iconColor" :icon="icon" />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="text-center">
        <v-col>
          <p class="text-center text-h5 font-weight-bold">{{ title }}</p>
          <p class="text-center" v-html="body" />
        </v-col>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn @click="cancel" :color="props.cancelBtnColor" data-test-id="confirmDialog-cancel" variant="outlined">
          {{ cancelBtnLabel }}
        </v-btn>
        <v-spacer />
        <v-btn @click="ok" :color="props.okBtnColor" data-test-id="confirmDialog-ok" variant="flat" >
          {{ okBtnLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style>
.tick-icon {
  animation: flip 1s ease-in-out;
  transform-style: preserve-3d;
  transform-origin: center center;
}

@keyframes flip {
  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(360deg);
  }
}
</style>
