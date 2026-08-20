import { ApiRegistry } from '../core/registry'
import { API_REGISTRY_KEY } from '../core/symbols'

export default defineNuxtPlugin((nuxtApp) => {
  const registry = new ApiRegistry()

  nuxtApp.vueApp.provide(API_REGISTRY_KEY, registry)
})
