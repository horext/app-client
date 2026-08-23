import { FETCH_KEY } from '../core/symbols'
import { $fetch } from 'ofetch'

export const createFetchApi = () => {
  const {
    public: { apiUrl },
  } = useRuntimeConfig()
  const fetch = $fetch.create({
    baseURL: apiUrl,
  })
  return fetch
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(FETCH_KEY, createFetchApi())
})
