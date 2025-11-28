import { createFetchApi, FETCH_KEY } from '../../runtime'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(FETCH_KEY, createFetchApi())
})
