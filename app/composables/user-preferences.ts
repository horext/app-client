import { storeToRefs } from 'pinia'
import type { Weekdays } from '~/interfaces/event'

export const useUserPreferences = () => {
  const store = useUserPreferencesStore()
  const service = usePreferencesService()
  const { preferences, weekDays, crossings, maxGenerationHistory } = storeToRefs(store)

  async function fetchPreferences() {
    const prefs = await service.getPreferences()
    if (prefs) preferences.value = prefs
  }

  async function createPreferences() {
    await service.createPreferences()
  }

  async function updateCrossings(_crossings: number) {
    if (preferences.value)
      preferences.value = { ...preferences.value, crossings: _crossings }
    await service.patch({ crossings: _crossings })
  }

  async function saveWeekDays(data: Weekdays[]) {
    if (preferences.value)
      preferences.value = { ...preferences.value, weekDays: data }
    await service.patch({ weekDays: data })
  }

  async function updateMaxGenerationHistory(n: number) {
    if (preferences.value)
      preferences.value = { ...preferences.value, maxGenerationHistory: n }
    await service.patch({ maxGenerationHistory: n })
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
}
