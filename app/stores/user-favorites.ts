import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { ScheduleGenerateId } from '~~/shared/domain'

export const useUserFavoritesStore = defineStore('user-favorites', () => {
  const favoritesSchedules = ref<IScheduleGenerate[]>([])

  function setFavorites(schedules: IScheduleGenerate[]) {
    favoritesSchedules.value = schedules
  }

  function addFavorite(schedule: IScheduleGenerate) {
    favoritesSchedules.value.push(schedule)
  }

  function removeFavoriteById(id: ScheduleGenerateId) {
    favoritesSchedules.value = favoritesSchedules.value.filter(
      (schedule) => schedule.id !== id,
    )
  }

  function clearFavorites() {
    favoritesSchedules.value = []
  }

  return {
    favoritesSchedules,
    setFavorites,
    addFavorite,
    removeFavoriteById,
    clearFavorites,
  }
})
