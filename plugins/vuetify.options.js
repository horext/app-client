import '@mdi/font/css/materialdesignicons.css'
import es from 'vuetify/es5/locale/es'
import en from 'vuetify/es5/locale/en'
// Ensure you are using css-loader
// Translation provided by Vuetify (typescript)

export default {
  customVariables: ['~/assets/variables.scss'],
  theme: {
    dark: false
  },
  icons: {
    iconfont: 'mdi' // default - only for display purposes
  },
  lang: {
    locales: { es, en },
    current: 'es'
  }
}
