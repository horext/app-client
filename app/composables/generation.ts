import { storeToRefs } from 'pinia'
import type { IBaseGeneratedSchedule } from '~/interfaces/schedule'
import type { IBaseIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IGenerationMeta } from '~/interfaces/generation-record'
import { toDomainSchedule } from '~/mappers/schedule/domain'

export const useGeneration = () => {
  const store = useGenerationStore()
  const service = useGenerationService()
  const userId = useSchedulesUserId()
  const preferencesStore = useUserPreferencesStore()
  const { result, history } = storeToRefs(store)

  async function setResult(
    newSchedules: IBaseGeneratedSchedule[],
    newOccurrences: IBaseIntersectionOccurrence[],
    meta: IGenerationMeta,
  ): Promise<void> {
    if (!service) return
    const _result = await service.saveGeneration(
      userId,
      meta,
      newSchedules.map(toDomainSchedule),
      newOccurrences,
      preferencesStore.maxGenerationHistory,
    )
    store.setHistory(await service.getGenerations(userId))
    store.setResult(_result)
  }

  async function loadSaved(): Promise<void> {
    if (!service) return
    const [records, latest] = await Promise.all([
      service.getGenerations(userId),
      service.getLatestGeneration(userId),
    ])
    store.setHistory(records)
    store.setResult(latest ?? null)
  }

  return {
    result,
    history,
    setResult,
    loadSaved,
    clear: store.clear,
  }
}
