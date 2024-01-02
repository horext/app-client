import {
  defineNuxtModule,
  addComponent,
  addPlugin,
  createResolver,
  addImports,
} from 'nuxt/kit'
import importMap from 'vuetify/dist/json/importMap.json' assert { type: 'json' }

export default defineNuxtModule({
  meta: {
    name: 'vuetify',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    const componentsMap: Record<
      string,
      {
        from: string
        styles: never[]
      }
    > = importMap.components
    for (const component in componentsMap) {
      addComponent({
        name: component,
        export: component,
        filePath:
          'vuetify/' +
          componentsMap[component].from.replace(/\/index\.mjs$/, ''),
      })
    }

    for (const directive of importMap.directives) {
      addImports({
        name: directive,
        from: 'vuetify/directives',
      })
    }

    addImports({
      name: 'useDisplay',
      from: 'vuetify',
    })

    addImports({
      name: 'useTheme',
      from: 'vuetify',
    })

    addPlugin({
      src: resolver.resolve('runtime/plugins/vuetify.ts'), // path to the component file
    })
  },
})
