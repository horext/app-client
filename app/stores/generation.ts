import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IGenerationMeta, IGenerationRecord, IGenerationResult } from '~/interfaces/generation-record'

export const useGenerationStore = defineStore('generation', () => {
  const generationService = useGenerationService()
  const preferencesStore = useUserPreferencesStore()

  const result = ref<IGenerationResult | null>(null)
  const history = ref<IGenerationRecord[]>([])

  async function setResult(
    newSchedules: IScheduleGenerate[],
    newOccurrences: IIntersectionOccurrence[],
    meta: IGenerationMeta,
  ): Promise<void> {
    const _result = await generationService.saveGeneration(
      meta,
      newSchedules,
      newOccurrences,
      preferencesStore.maxGenerationHistory,
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
    setResult,
    loadSaved,
    clear,
  }
})
