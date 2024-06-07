import { fileURLToPath, URL } from 'url'
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  build: {
    lib: {
      entry: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src/index.js'),
      name: 'mua-frontend',
      fileName: (format) => `mua-frontend.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'pinia', 'pinia-list-store', 'vue-image-crop-upload'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
