import { addPlugin, createResolver, defineNuxtModule } from 'nuxt/kit'

/** Synchronization bounded context. Runtime services are consumed explicitly. */
export default defineNuxtModule({
  meta: { name: 'synchronization' },
  setup() {
    const resolver = createResolver(import.meta.url)
    addPlugin({ src: resolver.resolve('runtime/plugins/provide.client') })
    addPlugin({ src: resolver.resolve('runtime/plugins/provide.server') })
  },
})
