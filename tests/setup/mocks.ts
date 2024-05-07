import { mockNuxtImport } from '@nuxt/test-utils/runtime'

mockNuxtImport<typeof useStorage>('useStorage', () => {
  return () => {
    return { value: 'mocked storage' }
  }
})
