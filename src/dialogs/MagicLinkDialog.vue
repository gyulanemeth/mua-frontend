<script setup>
import { ref } from 'vue'

const emit = defineEmits(['send'])

const showDialog = ref(false)
const email = ref('')
const processing = ref(false)
const sent = ref(false)

const show = (prefillEmail) => {
  email.value = prefillEmail || ''
  sent.value = false
  showDialog.value = true
}

const hide = () => {
  showDialog.value = false
  processing.value = false
}

const send = () => {
  if (!email.value) return
  processing.value = true
  emit('send', email.value, (success) => {
    processing.value = false
    if (success) sent.value = true
  })
}

defineExpose({ show, hide })
</script>

<template>
  <v-dialog v-model="showDialog" @keydown.esc="hide" width="auto">
    <v-card flat width="100%" max-width="480" class="ma-auto pa-2 rounded-xl">
      <v-card-text v-if="!sent" align="center">
        <v-icon size="40" color="primary" class="mb-3">mdi-email-fast-outline</v-icon>
        <p class="text-h6 mb-1">{{ $t('mua.userLoginAndResetForm.magicLink.sendBtn') }}</p>
        <p class="text-body-2 text-medium-emphasis mb-4">{{ $t('mua.userLoginAndResetForm.magicLink.dialogMessage') }}</p>
        <v-text-field hide-details density="compact" class="mb-4 rounded" color="primary" variant="solo"
          type="email" :label="$t('mua.userLoginAndResetForm.emailPlaceHolder')"
          :value="email" @update:modelValue="v => email = v.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
          @keydown.enter="send" autofocus />
        <v-btn block color="primary" :disabled="!email" @click="send">
          {{ !processing ? $t('mua.userLoginAndResetForm.magicLink.sendBtn') : '' }}
          <v-progress-circular v-if="processing" :size="20" indeterminate />{{ processing ? $t('mua.processing') : '' }}
        </v-btn>
      </v-card-text>
      <v-card-text v-else align="center" class="py-6">
        <v-icon size="48" color="primary" class="mb-3">mdi-email-fast-outline</v-icon>
        <p class="text-h6 mb-2">{{ $t('mua.userLoginAndResetForm.magicLink.sentHeader') }}</p>
        <p class="text-body-2 text-medium-emphasis">{{ $t('mua.userLoginAndResetForm.magicLink.sentMessage') }}</p>
      </v-card-text>
      <v-card-actions v-if="!sent" class="justify-end pt-0">
        <v-btn variant="text" color="medium-emphasis" @click="hide">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
