import { storeToRefs } from 'pinia'
import type { IBaseGeneratedSchedule } from '~/interfaces/schedule'
import type { IBaseIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IScheduleGenerationParameters } from '~/interfaces/schedule-generation'
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
    parameters: IScheduleGenerationParameters,
  ): Promise<void> {
    const _result = await service.saveGeneration(
      userId,
      parameters,
      newSchedules.map(toDomainSchedule),
      newOccurrences,
      preferencesStore.maxGenerationHistory,
    )
    store.setHistory(
      (await service.getGenerations(userId)).map((generation) =>
        generation.toSnapshot(),
      ),
    )
    store.setResult({
      ..._result.generation.toSnapshot(),
      schedules: _result.schedules.map((schedule) => schedule.toSnapshot()),
      occurrences: _result.occurrences,
    })
  }

  async function loadSaved(): Promise<void> {
    const [records, latest] = await Promise.all([
      service.getGenerations(userId),
      service.getLatestGeneration(userId),
    ])
    store.setHistory(records.map((generation) => generation.toSnapshot()))
    store.setResult(
      latest
        ? {
            ...latest.generation.toSnapshot(),
            schedules: latest.schedules.map((schedule) =>
              schedule.toSnapshot(),
            ),
            occurrences: latest.occurrences,
          }
        : null,
    )
  }

  return {
    result,
    history,
    setResult,
    loadSaved,
    clear: store.clear,
  }
}
