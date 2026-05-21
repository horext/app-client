import {
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
} from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'schedules-storage',
  },
  setup() {
    const resolver = createResolver(import.meta.url)

    addImports([
      {
        name: 'useFavoritesSchedulesService',
        from: resolver.resolve('runtime/app/composables/index'),
      },
      {
        name: 'useActivitiesService',
        from: resolver.resolve('runtime/app/composables/index'),
      },
      {
        name: 'useProfileService',
        from: resolver.resolve('runtime/app/composables/index'),
      },
      {
        name: 'useAcademicConfigService',
        from: resolver.resolve('runtime/app/composables/index'),
      },
      {
        name: 'usePreferencesService',
        from: resolver.resolve('runtime/app/composables/index'),
      },
      {
        name: 'useGenerationService',
        from: resolver.resolve('runtime/app/composables/index'),
      },
    ])

    addPlugin({
      src: resolver.resolve('runtime/plugins/provide.client'),
    })

    addPlugin({
      src: resolver.resolve('runtime/plugins/provide.server'),
    })

    addPlugin({
      src: resolver.resolve('runtime/plugins/provide-services'),
    })

    addPlugin({
      src: resolver.resolve('runtime/plugins/migration.client'),
    })
  },
})
