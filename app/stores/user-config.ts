import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ISelectedSubject } from '~/interfaces/subject'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserConfigStore = defineStore('user-config', () => {
  const subjects = ref<Array<ISelectedSubject>>([])
  const favoritesSchedules = ref<IScheduleGenerate[]>([])

  return {
    subjects,
    favoritesSchedules,
  }
})
