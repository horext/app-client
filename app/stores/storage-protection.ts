import type { MaybeRefOrGetter } from 'vue'
import { computed, ref, toValue } from 'vue'
import { defineStore } from 'pinia'
import { StorageProtectionStatus } from '~/models/StorageProtectionStatus'

export const useStorageProtectionStore = defineStore(
  'storage-protection',
  () => {
    const status = ref(StorageProtectionStatus.CHECKING)
    const protectionLost = ref(false)
    const dismissedUntil = ref<string>()
    const requesting = ref(false)
    const requestFailed = ref(false)

    function startCheck() {
      status.value = StorageProtectionStatus.CHECKING
    }

    function markUnsupported() {
      status.value = StorageProtectionStatus.UNSUPPORTED
    }

    function completeCheck(
      isPersisted: boolean,
      previouslyProtected: boolean,
      dismissedUntilValue?: string,
    ) {
      status.value = isPersisted
        ? StorageProtectionStatus.PROTECTED
        : StorageProtectionStatus.UNPROTECTED
      protectionLost.value = !isPersisted && previouslyProtected
      dismissedUntil.value = isPersisted ? undefined : dismissedUntilValue
    }

    function startRequest() {
      requesting.value = true
      requestFailed.value = false
    }

    function completeRequest(granted: boolean) {
      status.value = granted
        ? StorageProtectionStatus.PROTECTED
        : StorageProtectionStatus.UNPROTECTED
      requestFailed.value = !granted

      if (granted) {
        protectionLost.value = false
        dismissedUntil.value = undefined
      }
    }

    function failRequest() {
      requestFailed.value = true
    }

    function finishRequest() {
      requesting.value = false
    }

    function remindUntil(until: string) {
      dismissedUntil.value = until
      protectionLost.value = false
    }

    function dismissRequestFailure() {
      requestFailed.value = false
    }

    const reminderExpired = computed(
      () =>
        !dismissedUntil.value ||
        new Date(dismissedUntil.value).getTime() <= Date.now(),
    )

    function shouldPrompt(hasMeaningfulData: MaybeRefOrGetter<boolean>) {
      return computed(
        () =>
          status.value === StorageProtectionStatus.UNPROTECTED &&
          toValue(hasMeaningfulData) &&
          (protectionLost.value || reminderExpired.value),
      )
    }

    return {
      status,
      protectionLost,
      requesting,
      requestFailed,
      startCheck,
      markUnsupported,
      completeCheck,
      startRequest,
      completeRequest,
      failRequest,
      finishRequest,
      remindUntil,
      dismissRequestFailure,
      shouldPrompt,
    }
  },
)
