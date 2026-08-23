import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePersistentStorage } from '../persistent-storage'

describe('usePersistentStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    clearNuxtState()
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the request when storage is supported but not persistent', async () => {
    vi.stubGlobal('navigator', {
      storage: {
        persisted: vi.fn().mockResolvedValue(false),
        persist: vi.fn().mockResolvedValue(true),
      },
    })
    const storage = usePersistentStorage()

    await storage.check()

    const visible = storage.shouldPrompt(true)
    expect(visible.value).toBe(true)
    expect(await storage.request()).toBe(true)
    expect(visible.value).toBe(false)
  })

  it('waits 30 days after the user asks to be reminded later', async () => {
    vi.stubGlobal('navigator', {
      storage: {
        persisted: vi.fn().mockResolvedValue(false),
        persist: vi.fn(),
      },
    })
    const storage = usePersistentStorage()
    const visible = storage.shouldPrompt(true)

    await storage.check()
    storage.remindLater()

    expect(visible.value).toBe(false)
  })

  it('does not prompt until meaningful local data exists', async () => {
    vi.stubGlobal('navigator', {
      storage: {
        persisted: vi.fn().mockResolvedValue(false),
        persist: vi.fn(),
      },
    })
    const storage = usePersistentStorage()

    await storage.check()

    expect(storage.shouldPrompt(false).value).toBe(false)
  })

  it('warns immediately when previously granted protection is removed', async () => {
    localStorage.setItem(
      'storage-protection-preference',
      JSON.stringify({
        previouslyProtected: true,
        dismissedUntil: '2099-01-01T00:00:00.000Z',
      }),
    )
    vi.stubGlobal('navigator', {
      storage: {
        persisted: vi.fn().mockResolvedValue(false),
        persist: vi.fn(),
      },
    })
    const storage = usePersistentStorage()

    await storage.check()

    expect(storage.protectionLost.value).toBe(true)
    expect(storage.shouldPrompt(true).value).toBe(true)
  })
})
