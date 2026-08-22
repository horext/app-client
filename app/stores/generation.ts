import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  IGenerationRecord,
  IGenerationResult,
} from '~/interfaces/generation-record'

export const useGenerationStore = defineStore('generation', () => {
  const result = ref<IGenerationResult | null>(null)
  const history = ref<IGenerationRecord[]>([])

  function setResult(value: IGenerationResult | null) {
    result.value = value
  }

  function setHistory(value: IGenerationRecord[]) {
    history.value = value
  }

  function updateSchedules(value: IGenerationResult['schedules']) {
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
