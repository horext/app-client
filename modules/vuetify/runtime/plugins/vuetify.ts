import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
//@ts-ignore
import { createVuetify } from 'vuetify/framework'
import { es, en } from 'vuetify/locale'
import colors from 'vuetify/util/colors'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    locale: {
      locale: 'es',
      messages: {
        es,
        en,
      },
    },
    theme: {
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: colors.blue.darken2,
            accent: colors.grey.darken3,
            secondary: colors.amber.darken3,
            info: colors.teal.lighten1,
            warning: colors.amber.base,
            error: colors.deepOrange.accent4,
            success: colors.green.accent3,
          },
        },
        light: {
          dark: false,
          colors: {
            primary: colors.blue.darken2,
            accent: colors.grey.darken3,
            secondary: colors.amber.darken3,
            info: colors.teal.lighten1,
            warning: colors.amber.base,
            error: colors.deepOrange.accent4,
            success: colors.green.accent3,
          },
        },
      },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
