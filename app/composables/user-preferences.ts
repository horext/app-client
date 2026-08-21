import { storeToRefs } from 'pinia'
import type { Weekdays } from '~/interfaces/event'

export const useUserPreferences = () => {
  const store = useUserPreferencesStore()
  const service = usePreferencesService()
  const userId = useSchedulesUserId()
  const { preferences, weekDays, crossings, maxGenerationHistory } =
    storeToRefs(store)

  async function fetchPreferences() {
    const prefs = await service.get(userId)
    if (prefs) preferences.value = prefs
  }

  async function createPreferences() {
    await service.create(userId)
  }

  async function updateCrossings(_crossings: number) {
    const result = await service.patch(userId, { crossings: _crossings })
    preferences.value = result
  }

  async function saveWeekDays(data: Weekdays[]) {
    const result = await service.patch(userId, { weekDays: data })
    preferences.value = result
  }

  async function updateMaxGenerationHistory(n: number) {
    const result = await service.patch(userId, { maxGenerationHistory: n })
    preferences.value = result
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
