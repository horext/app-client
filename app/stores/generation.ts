import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IGenerationMeta, IGenerationRecord, IGenerationResult } from '~/interfaces/generation-record'

export const useGenerationStore = defineStore('generation', () => {
  const generationService = useGenerationService()
  const configStore = useUserConfigStore()

  const result = ref<IGenerationResult | null>(null)
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
    const _result = await generationService.saveGeneration(
      meta,
      newSchedules,
      newOccurrences,
      configStore.maxGenerationHistory,
    )
    history.value = await generationService.getGenerations()
    result.value = _result
  }

  async function loadSaved(): Promise<void> {
    const [records, latest] = await Promise.all([
      generationService.getGenerations(),
      generationService.getLatestGeneration(),
    ])

    history.value = records
    result.value = latest ?? null
  }

  function clear(): void {
    result.value = null
    history.value = []
  }

  return {
    result,
    history,
    latestRecord,
    setResult,
    loadSaved,
    clear,
  }
})
