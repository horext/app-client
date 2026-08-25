import { storeToRefs } from 'pinia'
import type { Weekdays } from '~/interfaces/event'
import { toPreferencesDto } from '~/mappers/domain/entities'

export const useUserPreferences = () => {
  const store = useUserPreferencesStore()
  const service = usePreferencesService()
  const userId = useSchedulesUserId()
  const {
    preferences,
    weekDays,
    crossings,
    maxGenerationHistory,
    loadingPreferences,
  } = storeToRefs(store)

  async function fetchPreferences() {
    loadingPreferences.value = true
    try {
      const prefs = await service.get(userId)
      if (prefs) preferences.value = toPreferencesDto(prefs)
    } finally {
      loadingPreferences.value = false
    }
  }

  async function createPreferences() {
    await service.create(userId)
  }

  async function updateCrossings(_crossings: number) {
    const result = await service.patch(userId, { crossings: _crossings })
    preferences.value = toPreferencesDto(result)
  }

  async function saveWeekDays(data: Weekdays[]) {
    const result = await service.patch(userId, { weekDays: data })
    preferences.value = toPreferencesDto(result)
  }

  async function updateMaxGenerationHistory(n: number) {
    const result = await service.patch(userId, { maxGenerationHistory: n })
    preferences.value = toPreferencesDto(result)
  }

  return {
    preferences,
    weekDays,
    crossings,
    maxGenerationHistory,
    loadingPreferences,
    fetchPreferences,
    createPreferences,
    updateCrossings,
    saveWeekDays,
    updateMaxGenerationHistory,
  }
}
