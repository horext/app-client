import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import { useGoogleAccounts } from '../gsi'

const { mockUseScript } = vi.hoisted(() => ({
  mockUseScript: vi.fn(() => ({
    onLoaded: vi.fn(),
    load: vi.fn(),
    status: { value: 'idle' },
  })),
}))

mockNuxtImport('useScript', () => mockUseScript)

describe('useGoogleAccounts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useScript with the Google GSI client URL', () => {
    useGoogleAccounts()
    expect(mockUseScript).toHaveBeenCalledWith(
      expect.objectContaining({
        src: 'https://accounts.google.com/gsi/client',
        async: true,
        key: 'google-accounts',
      }),
      expect.objectContaining({
        trigger: 'onNuxtReady',
      }),
    )
  })

  it('returns the useScript result', () => {
    const result = useGoogleAccounts()
    expect(result).toBeDefined()
    expect(result.onLoaded).toBeTypeOf('function')
  })
})
