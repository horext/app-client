const PREFERENCE_KEY = 'storage-protection-preference'
const REMINDER_DELAY_MS = 24 * 60 * 60 * 1000

interface StorageProtectionPreference {
  dismissedUntil?: string
  previouslyProtected: boolean
  requestedProtection?: boolean
}

export type StorageProtectionStatus =
  'checking' | 'unsupported' | 'protected' | 'unprotected'

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
    () => 'checking',
  )
  const protectionLost = useState('storage-protection-lost', () => false)
  const dismissedUntil = useState<string | undefined>(
    'storage-protection-dismissed-until',
    () => undefined,
  )
  const requestedProtection = useState(
    'storage-protection-requested',
    () => false,
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
    status.value = 'checking'
    const storage = navigator.storage as Partial<StorageManager> | undefined
    if (
      !storage ||
      typeof storage.persisted !== 'function' ||
      typeof storage.persist !== 'function'
    ) {
      status.value = 'unsupported'
      return
    }

    const preference = readPreference()
    dismissedUntil.value = preference.dismissedUntil
    requestedProtection.value = preference.requestedProtection ?? false

    try {
      const isPersisted = await storage.persisted()
      status.value = isPersisted ? 'protected' : 'unprotected'
      protectionLost.value = !isPersisted && preference.previouslyProtected

      if (isPersisted && !preference.previouslyProtected) {
        writePreference({ ...preference, previouslyProtected: true })
        dismissedUntil.value = undefined
      }
    } catch {
      status.value = 'unsupported'
    }
  }

  const request = async () => {
    requesting.value = true
    requestFailed.value = false
    try {
      const storage = navigator.storage as Partial<StorageManager> | undefined
      const granted = (await storage?.persist?.()) ?? false
      status.value = granted ? 'protected' : 'unprotected'
      requestFailed.value = !granted
      requestedProtection.value = true

      const farFuture = '2099-12-31T23:59:59.999Z'
      dismissedUntil.value = granted ? undefined : farFuture
      protectionLost.value = false

      writePreference({
        dismissedUntil: granted ? undefined : farFuture,
        previouslyProtected: granted,
        requestedProtection: true,
      })

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
    requestedProtection.value = false
    writePreference({
      dismissedUntil: until,
      previouslyProtected: false,
      requestedProtection: false,
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
        !requestedProtection.value &&
        status.value === 'unprotected' &&
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
