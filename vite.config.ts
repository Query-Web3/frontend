import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

const isDev = process.env.NODE_ENV === 'development';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: isDev ? {
      '/gql': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
    } : {}
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `@use "@/assets/base.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
