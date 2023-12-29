import vuetify from 'vite-plugin-vuetify'

const config = defineNuxtConfig({
  // Global page headers: https://go.nuxtjs.dev/config-head
  app: {
    head: {
      titleTemplate: '%s - Horext',
      title: 'Bienvenido',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content:
            'Horext es una aplicación web que te ayuda a generar horarios ',
        },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@pinia/nuxt',
    [
      '@vueuse/nuxt',
      {
        ssrHandlers: true,
      },
    ],
  ],
  runtimeConfig: {
    public: {
      googleApi: {
        clientId: process.env.NUXT_ENV_GOOGLE_CLIENT_ID,
        apiKey: process.env.NUXT_ENV_GOOGLE_API_KEY,
        discoveryDocs: (process.env.NUXT_ENV_GOOGLE_DISCOVERY_DOCS || '').split(
          ','
        ),
        scopes: process.env.NUXT_ENV_GOOGLE_SCOPES,
      },
      googleAnalytics: {
        id: process.env.NUXT_ENV_GOOGLE_ANALYTICS_ID,
      },
    },
    baseURL: process.env.BASE_URL,
  },

  routeRules: {
    '/api/**': { proxy: `${process.env.NUXT_ENV_API_URL}/**` },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify

  build: {
    transpile: ['vuetify'],
  },
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins?.push(
        vuetify({
          autoImport: true,
        })
      )
    },
  },
})

export default config
