import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IGenerationMeta, IGenerationRecord } from '~/interfaces/generation-record'

export const useGenerationStore = defineStore('generation', () => {
  const generationService = useGenerationService()
  const configStore = useUserConfigStore()

  const schedules = ref<IScheduleGenerate[]>([])
  const occurrences = ref<IIntersectionOccurrence[]>([])
  const history = ref<IGenerationRecord[]>([])

  const latestRecord = computed<IGenerationRecord | undefined>(() => {
    if (history.value.length === 0) return undefined
    return history.value[history.value.length - 1]
  })

  async function setResult(
    newSchedules: IScheduleGenerate[],
    newOccurrences: IIntersectionOccurrence[],
    meta: IGenerationMeta,
  ): Promise<void> {
    const record = await generationService.saveGeneration(
      meta,
      newSchedules,
      configStore.maxGenerationHistory,
    )

    history.value = [...history.value, record]
    schedules.value = newSchedules
    occurrences.value = newOccurrences
  }

  async function loadSaved(): Promise<void> {
    const records = await generationService.getGenerations()
    history.value = records

    const latest = records[records.length - 1]
    if (latest) {
      schedules.value =
        await generationService.getSchedulesForGeneration(latest)
    } else {
      schedules.value = []
    }
    occurrences.value = []
  }

  function clear(): void {
    schedules.value = []
    occurrences.value = []
    history.value = []
  }

  return {
    schedules,
    occurrences,
    history,
    latestRecord,
    setResult,
    loadSaved,
    clear,
  }
})
