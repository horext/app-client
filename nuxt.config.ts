import { defineNuxtConfig } from 'nuxt/config'

const isVitest = process.env.VITEST === 'true'

export default defineNuxtConfig({
  // Global page headers: https://go.nuxtjs.dev/config-head
  app: {
    head: {
      titleTemplate: '%s - Horext',
      title: 'Bienvenido',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          key: 'description',
          name: 'description',
          content:
            'Horext es una aplicación web que te ayuda a generar horarios ',
        },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      htmlAttrs: {
        lang: 'es',
      },
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    './modules/apis',
    './modules/schedules-storage',
    '@pinia/nuxt',
    ...(!isVitest ? (['@unocss/nuxt'] as const) : []),
    [
      '@vueuse/nuxt',
      {
        ssrHandlers: true,
      },
    ],
    '@nuxt/test-utils/module',
    'nuxt-gtag',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/eslint',
  ],

  css: ['~/assets/styles/layers.css', 'vuetify/styles'],

  vuetify: {
    disableGlobalStyles: true,
  },

  unocss: {
    disableNuxtInlineStyle: false,
  },

  image: {
    dir: 'assets/images',
  },

  runtimeConfig: {
    apiUpstreamUrl: process.env.NUXT_PUBLIC_API_URL ?? '',
    public: {
      gsi: {
        clientId: '',
        discoveryDocs: '',
        scopes: '',
      },
      apiUrl: '/api',
    },
    gsi: {
      apiKey: '',
    },
  },

  experimental: {
    componentIslands: true,
  },

  routeRules: {
    '/generator/**': {
      ssr: false,
    },
    '/login': {
      prerender: true,
    },
    '/plans': {
      prerender: true,
    },
    '/about': {
      prerender: true,
    },
    '/terms': {
      prerender: true,
    },
    '/privacy': {
      prerender: true,
    },
    '/security': {
      prerender: true,
    },
    '/': {
      prerender: true,
    },
  },

  nitro: {
    externals: {
      inline: ['unhead', '@unhead/vue'],
    },
  },

  compatibilityDate: '2024-08-18',
})
