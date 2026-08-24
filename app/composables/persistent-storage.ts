import { StorageProtectionStatus } from '~/models/StorageProtectionStatus'

const PREFERENCE_KEY = 'storage-protection-preference'
const REMINDER_DELAY_MS = 30 * 24 * 60 * 60 * 1000

interface StorageProtectionPreference {
  dismissedUntil?: string
  previouslyProtected: boolean
}

const readPreference = (): StorageProtectionPreference => {
  try {
    const value = localStorage.getItem(PREFERENCE_KEY)
    return value
      ? (JSON.parse(value) as StorageProtectionPreference)
      : { previouslyProtected: false }
  } catch {
    return { previouslyProtected: false }
  }
}

const writePreference = (value: StorageProtectionPreference) => {
  try {
    localStorage.setItem(PREFERENCE_KEY, JSON.stringify(value))
  } catch {
    // Storage protection still works when UX preferences cannot be saved.
  }
}

export function usePersistentStorage() {
  const isStandalone = useState('storage-protection-standalone', () => false)
  const status = useState<StorageProtectionStatus>(
    'storage-protection-status',
    () => StorageProtectionStatus.CHECKING,
  )
  const protectionLost = useState('storage-protection-lost', () => false)
  const dismissedUntil = useState<string | undefined>(
    'storage-protection-dismissed-until',
    () => undefined,
  )
  const requesting = useState('storage-protection-requesting', () => false)
  const requestFailed = useState(
    'storage-protection-request-failed',
    () => false,
  )

  const check = async () => {
    isStandalone.value =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    status.value = StorageProtectionStatus.CHECKING
    const storage = navigator.storage as Partial<StorageManager> | undefined
    if (
      !storage ||
      typeof storage.persisted !== 'function' ||
      typeof storage.persist !== 'function'
    ) {
      status.value = StorageProtectionStatus.UNSUPPORTED
      return
    }

    const preference = readPreference()
    dismissedUntil.value = preference.dismissedUntil

    try {
      const isPersisted = await storage.persisted()
      status.value = isPersisted
        ? StorageProtectionStatus.PROTECTED
        : StorageProtectionStatus.UNPROTECTED
      protectionLost.value = !isPersisted && preference.previouslyProtected

      if (isPersisted && !preference.previouslyProtected) {
        writePreference({ previouslyProtected: true })
        dismissedUntil.value = undefined
      }
    } catch {
      status.value = StorageProtectionStatus.UNSUPPORTED
    }
  }

  const request = async () => {
    requesting.value = true
    requestFailed.value = false
    try {
      const storage = navigator.storage as Partial<StorageManager> | undefined
      const granted = (await storage?.persist?.()) ?? false
      status.value = granted
        ? StorageProtectionStatus.PROTECTED
        : StorageProtectionStatus.UNPROTECTED
      requestFailed.value = !granted
      if (granted) {
        protectionLost.value = false
        dismissedUntil.value = undefined
        writePreference({ previouslyProtected: true })
      }
      return granted
    } catch {
      requestFailed.value = true
      return false
    } finally {
      requesting.value = false
    }
  }

  const remindLater = () => {
    const until = new Date(Date.now() + REMINDER_DELAY_MS).toISOString()
    dismissedUntil.value = until
    protectionLost.value = false
    writePreference({
      dismissedUntil: until,
      previouslyProtected: false,
    })
  }

  const dismissRequestFailure = () => {
    requestFailed.value = false
  }

  const reminderExpired = computed(
    () =>
      !dismissedUntil.value ||
      new Date(dismissedUntil.value).getTime() <= Date.now(),
  )

  const shouldPrompt = (hasMeaningfulData: MaybeRefOrGetter<boolean>) =>
    computed(
      () =>
        status.value === StorageProtectionStatus.UNPROTECTED &&
        toValue(hasMeaningfulData) &&
        (protectionLost.value || reminderExpired.value),
    )

  return {
    status: readonly(status),
    isStandalone: readonly(isStandalone),
    protectionLost: readonly(protectionLost),
    requesting: readonly(requesting),
    requestFailed: readonly(requestFailed),
    check,
    request,
    dismissRequestFailure,
    remindLater,
    shouldPrompt,
  }
}
