import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserFavoritesStore = defineStore('user-favorites', () => {
  const favoritesSchedules = ref<IScheduleGenerate[]>([])

  return {
    favoritesSchedules,
  }
})
