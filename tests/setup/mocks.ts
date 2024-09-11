import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { createStorage } from 'unstorage'
import memoryDriver from 'unstorage/drivers/memory'

mockNuxtImport('useStorage', () =>
  createStorage({
    driver: memoryDriver(),
  }),
)
