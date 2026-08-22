import type {
  GeneratedScheduleInput,
  IGeneratedSchedule,
} from '~/interfaces/schedule'
import { toDomainSchedule } from '~/mappers/schedule/domain'

export const useUserFavoriteSchedules = () => {
  const favoritesStorage = useFavoritesSchedulesService()
  const userId = useSchedulesUserId()
  const store = useUserFavoritesStore()
  const { favoritesSchedules } = storeToRefs(store)

  async function saveNewFavoriteSchedule(
    _favoritesSchedule: GeneratedScheduleInput,
  ) {
    const result = await favoritesStorage.addFavorite(
      userId,
      toDomainSchedule(_favoritesSchedule),
    )
    store.addFavorite(result.toSnapshot())
  }

  async function deleteFavoriteScheduleById(
    favoriteScheduleId: IGeneratedSchedule['id'],
  ) {
    await favoritesStorage.removeFavorite(userId, favoriteScheduleId)
    store.removeFavoriteById(favoriteScheduleId)
  }

  async function fetchFavoritesSchedules() {
    store.setFavorites(
      (await favoritesStorage.getFavoriteSchedules(userId)).map((schedule) =>
        schedule.toSnapshot(),
      ),
    )
  }

  return {
    favoritesSchedules,
    saveNewFavoriteSchedule,
    deleteFavoriteScheduleById,
    fetchFavoritesSchedules,
  }
}
