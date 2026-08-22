import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IPlannedSubject } from '~/interfaces/subject'

export const useUserSubjectsStore = defineStore('user-subjects', () => {
  const subjects = ref<Array<IPlannedSubject>>([])

  return {
    subjects,
  }
})
