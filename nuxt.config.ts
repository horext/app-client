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
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@pinia/nuxt',
    [
      '@vueuse/nuxt',
      {
        ssrHandlers: true,
      },
    ],
    '@nuxt/test-utils/module',
  ],
  runtimeConfig: {
    public: {
      googleApi: {
        clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
        apiKey: process.env.NUXT_PUBLIC_GOOGLE_API_KEY,
        discoveryDocs: (
          process.env.NUXT_PUBLIC_GOOGLE_DISCOVERY_DOCS || ''
        ).split(','),
        scopes: process.env.NUXT_PUBLIC_GOOGLE_SCOPES,
      },
      googleAnalytics: {
        id: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID,
      },
    },
    apiUrl: process.env.NUXT_API_URL,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  build: {
    transpile: ['vuetify'],
  },
  routeRules: {
    '/generator/**': {
      ssr: false,
    },
    '/': {
      prerender: true,
    },
    '/privacy': {
      prerender: true,
    },
    '/terms': {
      prerender: true,
    },
    '/about': {
      prerender: true,
    },
  },
})

export default config
