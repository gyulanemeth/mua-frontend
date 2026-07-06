<script setup>
import { ref } from 'vue'
import { useCaptchaStore, useTurnstileStore } from '../stores/index.js'
import TurnstileWidget from '../components/TurnstileWidget.vue'

const emit = defineEmits(['send'])

const captchaStore = useCaptchaStore()
const turnstileStore = useTurnstileStore()
const captchaType = import.meta.env.VITE_CAPTCHA_TYPE || 'svg'

const showDialog = ref(false)
const email = ref('')
const processing = ref(false)
const sent = ref(false)
const captchaData = ref()
const captchaText = ref('')
const captchaProbe = ref('')
const turnstileSiteKey = ref(null)
const turnstileWidget = ref(null)
const turnstileToken = ref(null)

async function generateCaptcha () {
  if (captchaType === 'turnstile') {
    if (!turnstileSiteKey.value) {
      const res = await turnstileStore.getTurnstileConfig()
      turnstileSiteKey.value = res.siteKey
    }
    return
  }
  const res = await captchaStore.getCaptcha()
  captchaData.value = res.data
  captchaProbe.value = res.probe
}

const show = (prefillEmail) => {
  email.value = prefillEmail || ''
  captchaText.value = ''
  turnstileToken.value = null
  sent.value = false
  showDialog.value = true
  generateCaptcha()
}

const hide = () => {
  showDialog.value = false
  processing.value = false
}

const send = () => {
  if (!email.value || !(captchaType === 'turnstile' ? turnstileToken.value : captchaText.value)) return
  processing.value = true
  emit('send', { email: email.value, captchaText: captchaText.value, captchaProbe: captchaProbe.value, turnstileToken: turnstileToken.value }, (success) => {
    processing.value = false
    if (success) {
      sent.value = true
    } else if (captchaType === 'turnstile') {
      turnstileWidget.value?.reset()
      turnstileToken.value = null
    } else {
      generateCaptcha()
    }
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
        <div v-if="captchaType !== 'turnstile'" class="d-flex flex-wrap align-center justify-center mb-4">
          <div v-html="captchaData"></div>
          <v-btn density="compact" size="large" class="rounded-0 elevation-0 mr-2"
            @click="generateCaptcha()" icon="mdi-refresh" />
          <v-text-field hide-details density="compact" class="mt-3 rounded" color="primary" variant="solo"
            name="captchaText" type="text" :placeholder="'Captcha text'" v-model="captchaText" required />
        </div>
        <TurnstileWidget v-else-if="turnstileSiteKey" ref="turnstileWidget" :sitekey="turnstileSiteKey"
          class="mb-4" @token="(t) => { turnstileToken = t }" />
        <v-btn block color="primary" :disabled="!email || !(captchaType === 'turnstile' ? turnstileToken : captchaText)" @click="send">
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
