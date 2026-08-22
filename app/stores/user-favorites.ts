import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IGeneratedSchedule } from '~/interfaces/schedule'
import type { GeneratedScheduleId } from '~~/shared/domain'

export const useUserFavoritesStore = defineStore('user-favorites', () => {
  const favoritesSchedules = ref<IGeneratedSchedule[]>([])

  function setFavorites(schedules: IGeneratedSchedule[]) {
    favoritesSchedules.value = schedules
  }

  function addFavorite(schedule: IGeneratedSchedule) {
    favoritesSchedules.value.push(schedule)
  }

  function removeFavoriteById(id: GeneratedScheduleId) {
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
