import Repositories from '~/repositories'

declare module '#app' {
  interface NuxtApp {
    $api: Repositories
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: Repositories
  }
}

const api = defineNuxtPlugin((nuxtApp) => {
  const apiFetcher = $fetch.create({
    baseURL: '/api',
  })
  nuxtApp.provide('api', new Repositories(apiFetcher))
})

export default api
