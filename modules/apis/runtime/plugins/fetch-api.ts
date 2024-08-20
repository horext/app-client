import { createFetchApi, FETCH_KEY } from '..'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(FETCH_KEY, createFetchApi())
})
