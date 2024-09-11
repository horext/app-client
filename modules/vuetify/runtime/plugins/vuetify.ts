//@ts-ignore
import { createVuetify } from 'vuetify/framework'
import { es } from 'vuetify/locale'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: {
      clientWidth: 1280,
      clientHeight: 1024,
    },
    locale: {
      locale: 'es',
      messages: {
        es,
      },
    },
    theme: {
     
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
