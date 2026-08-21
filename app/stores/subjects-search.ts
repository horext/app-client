import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SubjectSearchContext {
  specialityId: number | null
  studyPlanId: number | null
}

export const useSubjectsSearchStore = defineStore('subjects-search', () => {
  const context = ref<SubjectSearchContext>()

  const setContext = (value: SubjectSearchContext | undefined) => {
    context.value = value
  }

  return { context, setContext }
})
