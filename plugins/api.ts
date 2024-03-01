import repositories from '~/repositories'

declare module '#app' {
  interface NuxtApp {
    $api: ReturnType<typeof repositories>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: ReturnType<typeof repositories>
  }
}

const api = defineNuxtPlugin((nuxtApp) => {
  // Create a custom axios instance
  // Create a custom axios instance
  const api = $fetch.create({
    baseURL: '/api',
  })

  nuxtApp.provide('api', repositories(api))
})

export default api
