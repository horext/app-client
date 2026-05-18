import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUserPreferences } from '~/interfaces/preferences'
import type { Weekdays } from '~/interfaces/event'

export const useUserPreferencesStore = defineStore('user-preferences', () => {
  const preferencesService = usePreferencesService()

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

  async function fetchPreferences() {
    const prefs = await preferencesService.getPreferences()
    if (prefs) preferences.value = prefs
  }

  async function createPreferences() {
    await preferencesService.createPreferences()
  }

  async function updateCrossings(_crossings: number) {
    if (preferences.value)
      preferences.value = { ...preferences.value, crossings: _crossings }
    await preferencesService.patch({ crossings: _crossings })
  }

  async function saveWeekDays(data: Weekdays[]) {
    if (preferences.value)
      preferences.value = { ...preferences.value, weekDays: data }
    await preferencesService.patch({ weekDays: data })
  }

  async function updateMaxGenerationHistory(n: number) {
    if (preferences.value)
      preferences.value = { ...preferences.value, maxGenerationHistory: n }
    await preferencesService.patch({ maxGenerationHistory: n })
  }

  return {
    preferences,
    weekDays,
    crossings,
    maxGenerationHistory,
    fetchPreferences,
    createPreferences,
    updateCrossings,
    saveWeekDays,
    updateMaxGenerationHistory,
  }
})
