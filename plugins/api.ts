import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $api:NuxtAxiosInstance
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $api:NuxtAxiosInstance
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $api: NuxtAxiosInstance
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $api:NuxtAxiosInstance
  }
}

const api: Plugin = ({ $axios }, inject) => {
  // Create a custom axios instance
  const api = $axios.create({
  })

  // Set baseURL to something different
  api.setBaseURL(<string>process.env.API_URL_BROWSER)

  // Inject to context as $api
  inject('api', api)
}

export default api
