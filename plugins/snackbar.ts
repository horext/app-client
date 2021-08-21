import { Context, Plugin } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $snackbar(options :any): void
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $snackbar(options :any): void
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $snackbar(options :any): void
  }
}

const snackbar: Plugin = ({ store }: Context, inject: Inject) => {
  inject('snackbar', ({ content = '', color = '', timeout = null }) => {
    store.commit('modules/snackbar/showMessage', { content, color, timeout })
  })
}

export default snackbar
