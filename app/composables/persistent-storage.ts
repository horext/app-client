import { storeToRefs } from 'pinia'
import { useStorageProtectionStore } from '~/stores/storage-protection'
import { useStorageManager } from './storage-manager'

const PREFERENCE_KEY = 'storage-protection-preference'
const REMINDER_DELAY_MS = 30 * 24 * 60 * 60 * 1000

interface StorageProtectionPreference {
  dismissedUntil?: string
  previouslyProtected: boolean
}

function readPreference(): StorageProtectionPreference {
  try {
    const value = localStorage.getItem(PREFERENCE_KEY)
    return value
      ? (JSON.parse(value) as StorageProtectionPreference)
      : { previouslyProtected: false }
  } catch {
    return { previouslyProtected: false }
  }
}

function writePreference(value: StorageProtectionPreference) {
  try {
    localStorage.setItem(PREFERENCE_KEY, JSON.stringify(value))
  } catch {
    // Protection still works when UI preferences cannot be saved.
  }
}

export function usePersistentStorage() {
  const { isSupported, storage } = useStorageManager()
  const store = useStorageProtectionStore()
  const { status, protectionLost, requesting, requestFailed } =
    storeToRefs(store)

  async function check() {
    store.startCheck()
    const storageManager = storage.value
    if (!isSupported.value || !storageManager) {
      store.markUnsupported()
      return
    }

    const preference = readPreference()

    try {
      const isPersisted = await storageManager.persisted()
      store.completeCheck(
        isPersisted,
        preference.previouslyProtected,
        preference.dismissedUntil,
      )

      if (isPersisted && !preference.previouslyProtected) {
        writePreference({ previouslyProtected: true })
      }
    } catch {
      store.markUnsupported()
    }
  }

  async function request() {
    store.startRequest()
    try {
      const granted = (await storage.value?.persist?.()) ?? false
      store.completeRequest(granted)
      if (granted) writePreference({ previouslyProtected: true })
      return granted
    } catch {
      store.failRequest()
      return false
    } finally {
      store.finishRequest()
    }
  }

  function remindLater() {
    const until = new Date(Date.now() + REMINDER_DELAY_MS).toISOString()
    store.remindUntil(until)
    writePreference({
      dismissedUntil: until,
      previouslyProtected: false,
    })
  }

  return {
    status: readonly(status),
    protectionLost: readonly(protectionLost),
    requesting: readonly(requesting),
    requestFailed: readonly(requestFailed),
    check,
    request,
    dismissRequestFailure: store.dismissRequestFailure,
    remindLater,
    shouldPrompt: store.shouldPrompt,
  }
}
