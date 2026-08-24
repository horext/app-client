import {
  type Supportable,
  type ConfigurableWindow,
  defaultWindow,
} from '@vueuse/core'
import type { ShallowRef } from 'vue'

export interface StorageManagerState extends Supportable {
  storage: ShallowRef<StorageManager | undefined>
}

export type UseStorageManagerOptions = ConfigurableWindow

export type UseStorageManagerReturn = Readonly<StorageManagerState>

/**
 *
 * Reactive useStorageManager
 *
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useStorageManager(
  options: UseStorageManagerOptions = {},
): UseStorageManagerReturn {
  const { window = defaultWindow } = options

  const navigator = window?.navigator

  const isSupported = useSupported(
    () =>
      navigator &&
      typeof navigator.storage?.persisted === 'function' &&
      typeof navigator.storage.persist === 'function',
  )

  const storage = shallowRef<StorageManager | undefined>(navigator?.storage)

  // Listen to when to user changes storage:
  useEventListener(
    window,
    'storage',
    () => {
      if (navigator) storage.value = navigator.storage
    },
    { passive: true },
  )

  return {
    isSupported,
    storage,
  }
}
