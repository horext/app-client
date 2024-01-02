import {
  defineNuxtModule,
  addComponent,
  addPlugin,
  createResolver,
  addImports,
} from 'nuxt/kit'
import { COMPONENT_NAMES } from './components'
export default defineNuxtModule({
  meta: {
    name: 'vuetify',
  },
  setup() {
    const resolver = createResolver(import.meta.url)

    const components = COMPONENT_NAMES
    for (const component of components) {
      addComponent({
        name: component,
        export: component,
        filePath: 'vuetify/components',
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
