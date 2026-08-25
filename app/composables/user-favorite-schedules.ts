import type {
  GeneratedScheduleInput,
  IGeneratedSchedule,
} from '~/interfaces/schedule'
import { toDomainSchedule } from '~/mappers/schedule/domain'
import { toGeneratedScheduleDto } from '~/mappers/domain/entities'

export const useUserFavoriteSchedules = () => {
  const favoritesStorage = useFavoritesSchedulesService()
  const userId = useSchedulesUserId()
  const store = useUserFavoritesStore()
  const { favoritesSchedules, loadingFavorites } = storeToRefs(store)

  async function saveNewFavoriteSchedule(
    _favoritesSchedule: GeneratedScheduleInput,
  ) {
    const result = await favoritesStorage.addFavorite(
      userId,
      toDomainSchedule(_favoritesSchedule),
    )
    store.addFavorite(toGeneratedScheduleDto(result))
  }

  async function deleteFavoriteScheduleById(
    favoriteScheduleId: IGeneratedSchedule['id'],
  ) {
    await favoritesStorage.removeFavorite(userId, favoriteScheduleId)
    store.removeFavoriteById(favoriteScheduleId)
  }

  async function fetchFavoritesSchedules() {
    loadingFavorites.value = true
    try {
      const schedules = await favoritesStorage.getFavoriteSchedules(userId)
      store.setFavorites((schedules ?? []).map(toGeneratedScheduleDto))
    } finally {
      loadingFavorites.value = false
    }
  }

  return {
    favoritesSchedules,
    loadingFavorites,
    saveNewFavoriteSchedule,
    deleteFavoriteScheduleById,
    fetchFavoritesSchedules,
  }
}
