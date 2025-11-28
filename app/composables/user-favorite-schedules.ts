import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserFavoriteSchedules = () => {
  const storage = useLocalStorage()
  const configStore = useUserConfigStore()
  const { favoritesSchedules } = storeToRefs(configStore)

  async function saveNewFavoriteSchedule(
    _favoritesSchedule: IScheduleGenerate,
  ) {
    favoritesSchedules.value.push(Object.assign({}, _favoritesSchedule))
    await storage.setItem('myFavoritesSchedules', favoritesSchedules.value)
  }

  async function deleteFavoriteScheduleById(id: IScheduleGenerate['id']) {
    const index = favoritesSchedules.value.findIndex((s) => s.id === id)
    favoritesSchedules.value.splice(index, 1)
    await storage.setItem('myFavoritesSchedules', favoritesSchedules.value)
  }

  async function updateFavoritesSchedules(
    _favoritesSchedules: IScheduleGenerate[],
  ) {
    favoritesSchedules.value = _favoritesSchedules
    await storage.setItem('myFavoritesSchedules', favoritesSchedules.value)
  }

  const addFavoriteSchedule = async (schedule: IScheduleGenerate) => {
    await updateFavoritesSchedules([...favoritesSchedules.value, schedule])
  }

  async function fetchFavoritesSchedules() {
    const data =
      (await storage.getItem<IScheduleGenerate[]>('myFavoritesSchedules')) || []
    const _schedules: IScheduleGenerate[] = data || []
    favoritesSchedules.value = _schedules
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
