import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  IScheduleGeneration,
  IScheduleGenerationResult,
} from '~/interfaces/schedule-generation'

export const useGenerationStore = defineStore('generation', () => {
  const result = ref<IScheduleGenerationResult | null>(null)
  const history = ref<IScheduleGeneration[]>([])

  function setResult(value: IScheduleGenerationResult | null) {
    result.value = value
  }

  function setHistory(value: IScheduleGeneration[]) {
    history.value = value
  }

  function updateSchedules(value: IScheduleGenerationResult['schedules']) {
    if (result.value) result.value.schedules = value
  }

  function clear(): void {
    result.value = null
    history.value = []
  }

  return {
    result,
    history,
    setResult,
    setHistory,
    updateSchedules,
    clear,
  }
})
