import { storeToRefs } from 'pinia'
import type { Weekdays } from '~/interfaces/event'
import type { IBasePreferences } from '#shared/domain/types/preferences'

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

  async function createPreferences(initial: Partial<IBasePreferences> = {}) {
    preferences.value = await service.create(userId, initial)
  }

  async function updateCrossings(_crossings: number) {
    if (!preferences.value) {
      await createPreferences({ crossings: _crossings })
      return
    }
    preferences.value = { ...preferences.value, crossings: _crossings }
    await service.patch(userId, { crossings: _crossings })
  }

  async function saveWeekDays(data: Weekdays[]) {
    if (preferences.value)
      preferences.value = { ...preferences.value, weekDays: data }
    await service.patch(userId, { weekDays: data })
  }

  async function updateMaxGenerationHistory(n: number) {
    if (preferences.value)
      preferences.value = { ...preferences.value, maxGenerationHistory: n }
    await service.patch(userId, { maxGenerationHistory: n })
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
