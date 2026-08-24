import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { StorageProtectionStatus } from '~/models/StorageProtectionStatus'
import { useStorageProtectionStore } from '../storage-protection'

describe('useStorageProtectionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('tracks unsupported storage checks', () => {
    const store = useStorageProtectionStore()

    store.markUnsupported()

    expect(store.status).toBe(StorageProtectionStatus.UNSUPPORTED)
  })

  it('tracks lost protection and prompts when local data exists', () => {
    const store = useStorageProtectionStore()

    store.completeCheck(false, true)

    expect(store.status).toBe(StorageProtectionStatus.UNPROTECTED)
    expect(store.protectionLost).toBe(true)
    expect(store.shouldPrompt(true).value).toBe(true)
  })

  it('tracks successful protection requests', () => {
    const store = useStorageProtectionStore()

    store.startRequest()
    expect(store.requesting).toBe(true)

    store.completeRequest(true)
    store.finishRequest()

    expect(store.status).toBe(StorageProtectionStatus.PROTECTED)
    expect(store.requestFailed).toBe(false)
    expect(store.requesting).toBe(false)
  })

  it('hides the prompt until a reminder expires', () => {
    const store = useStorageProtectionStore()
    store.completeCheck(false, false)
    store.remindUntil('2099-01-01T00:00:00.000Z')

    expect(store.shouldPrompt(true).value).toBe(false)
  })
})
