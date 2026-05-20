import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserFavoritesStore = defineStore('user-favorites', () => {
  const favoritesSchedules = ref<IScheduleGenerate[]>([])

  const isFavorite = (schedule: IScheduleGenerate) => {
    return favoritesSchedules.value.findIndex(
      (x) => x.scheduleSubjectKey === schedule.scheduleSubjectKey,
    )
  }

  return {
    favoritesSchedules,
    isFavorite,
  }
})
