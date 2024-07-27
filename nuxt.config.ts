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
      htmlAttrs: {
        lang: 'es',
      },
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
    'nuxt-gtag',
    '@nuxt/image',
    '@nuxt/scripts',
  ],
  image: {
    dir: 'assets/images',
  },
  runtimeConfig: {
    public: {
      gsi: {
        clientId: '',
        discoveryDocs: '',
        scopes: '',
      },
    },
    apiUrl: '',
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
      prerender: true,
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
})

export default config
