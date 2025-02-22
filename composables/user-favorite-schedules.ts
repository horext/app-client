import type { IScheduleGenerate } from '~/interfaces/schedule'
import { useRuntimeConfig } from '#imports'

export const useUserFavoriteSchedules = () => {
  const storage = useLocalStorage()
  const configStore = useUserConfigStore()
  const { favoritesSchedules } = storeToRefs(configStore)
  const {
    public: { preferOfflineSave },
  } = useRuntimeConfig()

  async function saveNewFavoriteSchedule(
    _favoritesSchedule: IScheduleGenerate,
  ) {
    favoritesSchedules.value.push(Object.assign({}, _favoritesSchedule))
    await storage.setItem('myFavoritesSchedules', favoritesSchedules.value)
    if (!preferOfflineSave) {
      await $fetch('/api/favorite-schedules', {
        method: 'POST',
        body: _favoritesSchedule,
      })
    }
  }

  async function deleteFavoriteScheduleById(id: IScheduleGenerate['id']) {
    const index = favoritesSchedules.value.findIndex((s) => s.id === id)
    favoritesSchedules.value.splice(index, 1)
    await storage.setItem('myFavoritesSchedules', favoritesSchedules.value)
    if (!preferOfflineSave) {
      await $fetch(`/api/favorite-schedules/${id}`, {
        method: 'DELETE',
      })
    }
  }

  async function updateFavoritesSchedules(
    _favoritesSchedules: IScheduleGenerate[],
  ) {
    favoritesSchedules.value = _favoritesSchedules
    await storage.setItem('myFavoritesSchedules', favoritesSchedules.value)
    if (!preferOfflineSave) {
      await $fetch('/api/favorite-schedules', {
        method: 'PUT',
        body: _favoritesSchedules,
      })
    }
  }

  const addFavoriteSchedule = async (schedule: IScheduleGenerate) => {
    await updateFavoritesSchedules([...favoritesSchedules.value, schedule])
  }

  async function fetchFavoritesSchedules() {
    if (preferOfflineSave) {
      const data =
        (await storage.getItem<IScheduleGenerate[]>('myFavoritesSchedules')) ||
        []
      const _schedules: IScheduleGenerate[] = data || []
      favoritesSchedules.value = _schedules
    } else {
      const data = await $fetch<IScheduleGenerate[]>('/api/favorite-schedules')
      favoritesSchedules.value = data || []
    }
  }

  const removeFavoriteSchedule = async (schedule: IScheduleGenerate) => {
    const newFavorites = favoritesSchedules.value.filter(
      (s) => s.id !== schedule.id,
    )
    await updateFavoritesSchedules(newFavorites)
  }

  return {
    favoritesSchedules,
    saveNewFavoriteSchedule,
    deleteFavoriteScheduleById,
    updateFavoritesSchedules,
    addFavoriteSchedule,
    fetchFavoritesSchedules,
    removeFavoriteSchedule,
  }
}
