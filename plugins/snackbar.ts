
import type { Pinia } from 'pinia'
import { useGlobalSnackbarStore } from '~/stores/global-snackbar'


const snackbar = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('snackbar', ({ content = '', color = '', timeout = undefined }) => {
    useGlobalSnackbarStore(nuxtApp.$pinia as Pinia).showMessage({ content, color, timeout })
  })
})

export default snackbar
