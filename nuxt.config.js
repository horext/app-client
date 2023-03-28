export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
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
          'Horext es una aplicación web que te ayuda a generar horarios '
      },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/api.ts',
    '~/plugins/snackbar.ts',
    '~/plugins/snackbar-accessor.ts',
    { src: '~/plugins/html2canvas.client.js', mode: 'client' },
    '~/plugins/axios-accesor',
    '~/plugins/storage-accessor',
    '~/plugins/api-accessor'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/google-analytics',
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: false }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/universal-storage'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true
  },
  proxy: {
    '/api': {
      target: process.env.NUXT_ENV_API_URL,
      pathRewrite: { '^/api/': '/' }
    }
  },
  publicRuntimeConfig: {
    googleAnalytics: {
      id: process.env.NUXT_ENV_GOOGLE_ANALYTICS_ID
    },
    baseURL: process.env.BASE_URL,
    googleApi: {
      clientId: process.env.NUXT_ENV_GOOGLE_CLIENT_ID,
      apiKey: process.env.NUXT_ENV_GOOGLE_API_KEY,
      discoveryDocs: (process.env.NUXT_ENV_GOOGLE_DISCOVERY_DOCS || '').split(
        ','
      ),
      scopes: process.env.NUXT_ENV_GOOGLE_SCOPES
    }
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  storage: {
    initialState: {
      myFirstEntry: true
    },
    cookie: {
      prefix: '',
      options: {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 * 4
      }
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    optionsPath: '~/config/vuetify.options.js',
    customVariables: ['~/assets/variables.scss']
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
