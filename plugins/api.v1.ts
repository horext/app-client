import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $apiv1:NuxtAxiosInstance
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $apiv1:NuxtAxiosInstance
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $apiv1: NuxtAxiosInstance
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $apiv1:NuxtAxiosInstance
  }
}

const apiv1: Plugin = ({ $axios }, inject) => {
  // Create a custom axios instance
  const api = $axios.create({
    baseURL: '/api'
  })

  api.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })
  // Inject to context as $apiv1
  inject('apiv1', api)
}

export default apiv1
