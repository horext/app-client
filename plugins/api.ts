import { Plugin } from '@nuxt/types'
import repositories from '~/repositories'
export type Repositories = ReturnType<typeof repositories>

interface RepositoryPlugin {
  $api: Repositories
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue extends RepositoryPlugin {}
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions extends RepositoryPlugin {}
  // nuxtContext.$myInjectedFunction
  interface Context extends RepositoryPlugin {}
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $api: RepositoryPlugin
  }
}

const api: Plugin = ({ $axios, $config }, inject) => {
  // Create a custom axios instance
  // Create a custom axios instance
  const api = $axios.create({
    baseURL: $config.baseURL + '/api'
  })

  api.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })

  inject('api', repositories(api))
}

export default api
