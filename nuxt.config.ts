// https://nuxt.com/docs/api/configuration/nuxt-config
import Components from 'unplugin-vue-components/vite';
import { defineNuxtConfig } from 'nuxt/config';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { loadEnv } from 'vite'
import fs from 'fs-extra'
import path from 'path'

const envScript = (process.env as any).npm_lifecycle_script.split(' ')
const envName = envScript[envScript.length - 1] // 通过启动命令区分环境
const envData = loadEnv(envName, 'env') as any

export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '微信Bot助手'
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  runtimeConfig: {
    public: envData
  },
  devtools: { enabled: true },
  modules: [
    'nuxt-icon',
    '@pinia/nuxt'
  ],
  components: true,
  // hooks: {
  //   'build:done': () => {
  //     const srcDir = path.resolve('node_modules/wechaty-grpc/out');
  //     const destDir = path.resolve('dist/server/node_modules/wechaty-grpc/out');
  //     fs.copySync(srcDir, destDir);
  //   }
  // },
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'echarts',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer'
          ]
        : ['echarts', '@juggle/resize-observer']
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/main.scss" as *;',
        }
      }
    },
    plugins: [
      Components({
          resolvers: [NaiveUiResolver()], // Automatically register all components in the `components` directory
      })
    ],
    // @ ts-expect-error: Missing ssr key
    ssr: {
        noExternal: ['moment', 'naive-ui', '@juggle/resize-observer', '@css-render/vue3-ssr'],
    },
    optimizeDeps: {
        include: process.env.NODE_ENV === 'development'
        ? ['naive-ui', 'vueuc', 'date-fns-tz/formatInTimeZone']
        : []
    }
  },
  nitro: {
    output: {
        dir: '~/dist'
    }
  }
})
