import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  IGenerationRecord,
  IGenerationResult,
} from '~/interfaces/generation-record'

export const useGenerationStore = defineStore('generation', () => {
  const result = ref<IGenerationResult | null>(null)
  const history = ref<IGenerationRecord[]>([])

  function clear(): void {
    result.value = null
    history.value = []
  }

  return {
    result,
    history,
    clear,
  }
})
