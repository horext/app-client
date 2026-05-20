import { storeToRefs } from 'pinia'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IGenerationMeta } from '~/interfaces/generation-record'

export const useGeneration = () => {
  const store = useGenerationStore()
  const service = useGenerationService()
  const preferencesStore = useUserPreferencesStore()
  const { result, history } = storeToRefs(store)

  async function setResult(
    newSchedules: IScheduleGenerate[],
    newOccurrences: IIntersectionOccurrence[],
    meta: IGenerationMeta,
  ): Promise<void> {
    if (!service) return
    const _result = await service.saveGeneration(
      meta,
      newSchedules,
      newOccurrences,
      preferencesStore.maxGenerationHistory,
    )
    history.value = await service.getGenerations()
    result.value = _result
  }

  async function loadSaved(): Promise<void> {
    if (!service) return
    const [records, latest] = await Promise.all([
      service.getGenerations(),
      service.getLatestGeneration(),
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
