import { createResolver, defineNuxtModule, } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'HCalendar',
  },
  hooks: {
    'components:dirs': (dirs) => {
      const { resolve } = createResolver(import.meta.url)
      // Add ./components dir to the list
      dirs.push({
        path: resolve('./runtime/components'),
        prefix: 'H',
      })
    }
  },
})
