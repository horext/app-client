import Repositories from '~/repositories'

const api = defineNuxtPlugin((nuxtApp) => {
  const apiFetcher = $fetch.create({
    baseURL: '/api',
  })
  nuxtApp.provide('api', new Repositories(apiFetcher))
})

export default api
