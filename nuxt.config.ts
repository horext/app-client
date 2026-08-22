import { defineNuxtConfig } from 'nuxt/config'

const generatorShellRevision =
  process.env.BUILD_REVISION ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.CF_PAGES_COMMIT_SHA ??
  Date.now().toString(36)

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
    '@pinia/nuxt',
    '@unocss/nuxt',
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
    '@vite-pwa/nuxt',
  ],

  pwa: {
    registerType: 'autoUpdate',
    injectRegister: false,
    scope: '/generator',
    manifestFilename: 'generator.webmanifest',
    client: {
      registerPlugin: false,
    },
    manifest: {
      id: '/generator',
      name: 'Horext - Generador de Horarios',
      short_name: 'Horext',
      description:
        'Genera y administra tus horarios académicos desde tu dispositivo.',
      lang: 'es',
      start_url: '/generator',
      scope: '/generator',
      display: 'standalone',
      background_color: '#FFFFFF',
      theme_color: '#1976D2',
      categories: ['education', 'productivity'],
    },
    pwaAssets: {
      image: 'horext-icon.png',
      overrideManifestIcons: true,
      includeHtmlHeadLinks: false,
    },
    workbox: {
      additionalManifestEntries: [
        { url: '/generator', revision: generatorShellRevision },
      ],
      navigateFallback: '/generator',
      navigateFallbackAllowlist: [/^\/generator(?:\/.*)?$/],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      globPatterns: ['**/*.{js,css,png,svg,ico,woff2}'],
    },
  },

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
    public: {
      gsi: {
        clientId: '',
        discoveryDocs: '',
        scopes: '',
      },
      apiUrl: '',
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
