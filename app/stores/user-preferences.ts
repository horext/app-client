import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUserPreferences } from '~/interfaces/preferences'
import type { Weekdays } from '~/interfaces/event'

export const useUserPreferencesStore = defineStore('user-preferences', () => {
  const preferences = ref<IUserPreferences>()

  const weekDays = computed(
    () =>
      preferences.value?.weekDays ??
      ([0, 1, 2, 3, 4, 5, 6] satisfies Weekdays[]),
  )
  const crossings = computed(() => preferences.value?.crossings ?? 0)
  const maxGenerationHistory = computed(
    () => preferences.value?.maxGenerationHistory ?? 5,
  )

  return {
    preferences,
    weekDays,
    crossings,
    maxGenerationHistory,
  }
})
