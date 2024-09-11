import { addPlugin, createResolver, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'Apis',
  },
  setup() {
    const resolver = createResolver(import.meta.url)

    addPlugin({
      src: resolver.resolve('runtime/plugins/fetch-api.ts'),
    })
  },
})
