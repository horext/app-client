import { addImports, addPlugin, createResolver, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'schedules-storage',
  },
  setup() {
    const resolver = createResolver(import.meta.url)

    addImports([
      {
        name: 'useGeneratedSchedulesService',
        from: resolver.resolve('runtime/composables/index'),
      },
      {
        name: 'useFavoritesSchedulesService',
        from: resolver.resolve('runtime/composables/index'),
      },
    ])

    addPlugin({
      src: resolver.resolve('runtime/plugins/provide.client'),
    })

    addPlugin({
      src: resolver.resolve('runtime/plugins/migration.client'),
    })
  },
})
