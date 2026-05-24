import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '~/interfaces/schedule'

export const useUserFavoriteSchedules = () => {
  const favoritesStorage = useFavoritesSchedulesService()
  const store = useUserFavoritesStore()
  const { favoritesSchedules } = storeToRefs(store)

  async function saveNewFavoriteSchedule(
    _favoritesSchedule: IScheduleGenerate | IBaseScheduleGenerate,
  ) {
    const result = await favoritesStorage.addFavorite(_favoritesSchedule)
    favoritesSchedules.value.push(result)
  }

  async function deleteFavoriteScheduleById(id: IScheduleGenerate['id']) {
    await favoritesStorage.removeFavorite(id)
    const index = favoritesSchedules.value.findIndex((s) => s.id === id)
    favoritesSchedules.value.splice(index, 1)
  }

  async function fetchFavoritesSchedules() {
    favoritesSchedules.value =
      (await favoritesStorage.getFavoriteSchedules()) ?? []
  }

  return {
    favoritesSchedules,
    saveNewFavoriteSchedule,
    deleteFavoriteScheduleById,
    fetchFavoritesSchedules,
  }
}
