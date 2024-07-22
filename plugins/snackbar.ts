import type { Pinia } from 'pinia'
import { useGlobalSnackbarStore } from '~/stores/global-snackbar'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      snackbar: ({ content = '', color = '', timeout = undefined }) => {
        useGlobalSnackbarStore(nuxtApp.$pinia as Pinia).showMessage({
          content,
          color,
          timeout,
        })
      },
    },
  }
})
