
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ObserveVisibility } from 'vue-observe-visibility'
import i18n from './i18n'

loadFonts()
const pinia = createPinia()

createApp(App).use(i18n)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .directive('observe-visibility', {
    beforeMount: (el, binding, vnode) => {
      vnode.context = binding.instance
      ObserveVisibility.bind(el, binding, vnode)
    },
    update: ObserveVisibility.update,
    unmounted: ObserveVisibility.unbind
  })
  .mount('#app')
