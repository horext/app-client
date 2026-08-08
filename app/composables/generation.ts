import { storeToRefs } from 'pinia'
import type { IBaseScheduleGenerate } from '~/interfaces/schedule'
import type { IBaseIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IGenerationMeta } from '~/interfaces/generation-record'

export const useGeneration = () => {
  const store = useGenerationStore()
  const service = useGenerationService()
  const userId = useSchedulesUserId()
  const preferencesStore = useUserPreferencesStore()
  const { result, history } = storeToRefs(store)

  async function setResult(
    newSchedules: IBaseScheduleGenerate[],
    newOccurrences: IBaseIntersectionOccurrence[],
    meta: IGenerationMeta,
  ): Promise<void> {
    if (!service) return
    const _result = await service.saveGeneration(
      userId,
      meta,
      newSchedules,
      newOccurrences,
      preferencesStore.maxGenerationHistory,
    )
    history.value = await service.getGenerations(userId)
    result.value = _result
  }

  async function loadSaved(): Promise<void> {
    if (!service) return
    const [records, latest] = await Promise.all([
      service.getGenerations(userId),
      service.getLatestGeneration(userId),
    ])
    history.value = records
    result.value = latest ?? null
  }

  return {
    result,
    history,
    setResult,
    loadSaved,
    clear: store.clear,
  }
}
