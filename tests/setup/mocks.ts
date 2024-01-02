import { vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

mockNuxtImport<typeof useTheme>(
  'useTheme',
  () =>
    vi.fn(() => {
      return 'mocked in setup'
    }),
)


