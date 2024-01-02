import { createVuetify } from 'vuetify'
import * as directives from 'vuetify/directives'
import { es, en } from 'vuetify/locale'
import colors from 'vuetify/util/colors'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    directives,
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
  })

  nuxtApp.vueApp.use(vuetify)
})
