import { storeToRefs } from 'pinia'
import type { IBaseGeneratedSchedule } from '~/interfaces/schedule'
import type { IBaseIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IScheduleGenerationParameters } from '~/interfaces/schedule-generation'
import { toDomainSchedule } from '~/mappers/schedule/domain'
import {
  toGeneratedScheduleDto,
  toScheduleGenerationDto,
} from '~/mappers/domain/entities'

export const useGeneration = () => {
  const store = useGenerationStore()
  const service = useGenerationService()
  const userId = useSchedulesUserId()
  const preferencesStore = useUserPreferencesStore()
  const { result, history, loadingGeneration } = storeToRefs(store)

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
      (await service.getGenerations(userId)).map(toScheduleGenerationDto),
    )
    store.setResult({
      ...toScheduleGenerationDto(_result.generation),
      schedules: _result.schedules.map(toGeneratedScheduleDto),
      occurrences: _result.occurrences,
    })
  }

  async function loadSaved(): Promise<void> {
    loadingGeneration.value = true
    try {
      const [records, latest] = await Promise.all([
        service.getGenerations(userId),
        service.getLatestGeneration(userId),
      ])
      store.setHistory(records.map(toScheduleGenerationDto))
      store.setResult(
        latest
          ? {
              ...toScheduleGenerationDto(latest.generation),
              schedules: latest.schedules.map(toGeneratedScheduleDto),
              occurrences: latest.occurrences,
            }
          : null,
      )
    } finally {
      loadingGeneration.value = false
    }
  }

  return {
    result,
    history,
    loadingGeneration,
    setResult,
    loadSaved,
    clear: store.clear,
  }
}
