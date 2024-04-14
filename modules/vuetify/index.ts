import importMap from 'vuetify/dist/json/importMap.json' assert { type: 'json' }
import {
  defineNuxtModule,
  addComponent,
  addPlugin,
  createResolver,
  addImports,
} from 'nuxt/kit'

export interface ModuleOptions {
  /**
   * Disables the global css styles added by the module.
   */
  disableGlobalStyles?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vuetify',
  },
  defaults: {
    disableGlobalStyles: false,
  },
  async setup(options, nuxt) {
    nuxt.options.build.transpile.push('vuetify')

    if (!options.disableGlobalStyles) {
      nuxt.options.css.push('vuetify/styles')
    }

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
