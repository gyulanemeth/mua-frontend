<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({ sitekey: String })
const emit = defineEmits(['token'])

const container = ref(null)
let widgetId = null

function ensureScript () {
  return new Promise((resolve) => {
    if (window.turnstile) return resolve()
    if (document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      const check = setInterval(() => { if (window.turnstile) { clearInterval(check); resolve() } }, 50)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.onload = resolve
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  await ensureScript()
  widgetId = window.turnstile.render(container.value, {
    sitekey: props.sitekey,
    callback: (token) => emit('token', token),
    'expired-callback': () => emit('token', null),
    'error-callback': () => emit('token', null)
  })
})

onUnmounted(() => {
  if (widgetId !== null) window.turnstile.remove(widgetId)
})

defineExpose({
  reset () {
    if (widgetId !== null) window.turnstile.reset(widgetId)
  }
})
</script>

<template>
  <div ref="container"></div>
</template>
