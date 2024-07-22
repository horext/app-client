import Repositories from '~/repositories'

export default defineNuxtPlugin(() => {
  const apiFetcher = $fetch.create({
    baseURL: '/api',
  })

  return {
    provide: {
      api: new Repositories(apiFetcher),
    },
  }
})
