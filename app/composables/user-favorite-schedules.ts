import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserFavoriteSchedules = () => {
  const favoritesStorage = useFavoritesSchedulesService()
  const configStore = useUserConfigStore()
  const { favoritesSchedules } = storeToRefs(configStore)

  async function saveNewFavoriteSchedule(
    _favoritesSchedule: IScheduleGenerate,
  ) {
    await favoritesStorage.addFavorite(_favoritesSchedule)
    favoritesSchedules.value.push(Object.assign({}, _favoritesSchedule))
  }

  async function deleteFavoriteScheduleById(id: IScheduleGenerate['id']) {
    await favoritesStorage.removeFavorite(id)
    const index = favoritesSchedules.value.findIndex((s) => s.id === id)
    favoritesSchedules.value.splice(index, 1)
  }

  async function updateFavoritesSchedules(
    _favoritesSchedules: IScheduleGenerate[],
  ) {
    await favoritesStorage.saveFavorites(_favoritesSchedules)
    favoritesSchedules.value = _favoritesSchedules
  }

  const addFavoriteSchedule = async (schedule: IScheduleGenerate) => {
    await favoritesStorage.addFavorite(schedule)
    if (!favoritesSchedules.value.some((s) => s.id === schedule.id)) {
      favoritesSchedules.value.push(schedule)
    }
  }

  async function fetchFavoritesSchedules() {
    favoritesSchedules.value = await favoritesStorage.getFavoriteSchedules()
  }

  const removeFavoriteSchedule = async (schedule: IScheduleGenerate) => {
    await favoritesStorage.removeFavorite(schedule.id)
    favoritesSchedules.value = favoritesSchedules.value.filter(
      (s) => s.id !== schedule.id,
    )
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
