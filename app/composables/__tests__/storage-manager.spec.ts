import { describe, expect, it, vi } from 'vitest'
import { useStorageManager } from '../storage-manager'

function createWindow(storage?: Partial<StorageManager>) {
  let storageListener: EventListener | undefined
  const navigator = { storage }
  const window = {
    navigator,
    addEventListener: vi.fn((event: string, listener: EventListener) => {
      if (event === 'storage') storageListener = listener
    }),
    removeEventListener: vi.fn(),
  } as unknown as Window

  return {
    navigator,
    storageListener: () => storageListener,
    window,
  }
}

describe('useStorageManager', () => {
  it('exposes a supported StorageManager', () => {
    const storage = {
      persisted: vi.fn(),
      persist: vi.fn(),
    }
    const { window } = createWindow(storage)

    const manager = useStorageManager({ window })

    expect(manager.isSupported.value).toBe(true)
    expect(manager.storage.value).toBe(storage)
  })

  it('is unsupported when persistence methods are unavailable', () => {
    const { window } = createWindow({})

    const manager = useStorageManager({ window })

    expect(manager.isSupported.value).toBe(false)
  })

  it('refreshes the manager when the storage event fires', () => {
    const initialStorage = {
      persisted: vi.fn(),
      persist: vi.fn(),
    }
    const nextStorage = {
      persisted: vi.fn(),
      persist: vi.fn(),
    }
    const context = createWindow(initialStorage)
    const manager = useStorageManager({ window: context.window })

    context.navigator.storage = nextStorage
    context.storageListener()?.(new Event('storage'))

    expect(manager.storage.value).toBe(nextStorage)
  })
})
