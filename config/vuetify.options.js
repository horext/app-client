
import es from 'vuetify/es5/locale/es'
import en from 'vuetify/es5/locale/en'
import colors from 'vuetify/es5/util/colors'
// Ensure you are using css-loader
// Translation provided by Vuetify (typescript)

export default {
  customVariables: ['~/assets/variables.scss'],
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    }
  },
  lang: {
    locales: { es, en },
    current: 'es'
  }
}
