import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ISubjectSchedules } from '~/interfaces/subject'

export const useUserSubjectsStore = defineStore('user-subjects', () => {
  const subjects = ref<Array<ISubjectSchedules>>([])

  return {
    subjects,
  }
})
