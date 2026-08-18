import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '~/interfaces/schedule'

export const useUserFavoriteSchedules = () => {
  const favoritesStorage = useFavoritesSchedulesService()
  const userId = useSchedulesUserId()
  const store = useUserFavoritesStore()
  const { favoritesSchedules } = storeToRefs(store)

  async function saveNewFavoriteSchedule(
    _favoritesSchedule: IScheduleGenerate | IBaseScheduleGenerate,
  ) {
    const result = await favoritesStorage.addFavorite(userId, {
      ..._favoritesSchedule,
      schedulesSubject: _favoritesSchedule.schedulesSubject.map(
        (scheduleSubject) => ({
          ...scheduleSubject,
          sessions: scheduleSubject.sessions.map((session) => ({
            ...session,
            classroom: {
              ...session.classroom,
              name: session.classroom.name ?? undefined,
            },
          })),
        }),
      ),
    })
    favoritesSchedules.value.push(result)
  }

  async function deleteFavoriteScheduleById(
    favoriteScheduleId: IScheduleGenerate['id'],
  ) {
    await favoritesStorage.removeFavorite(userId, favoriteScheduleId)
    const index = favoritesSchedules.value.findIndex(
      (s) => s.id === favoriteScheduleId,
    )
    if (index >= 0) favoritesSchedules.value.splice(index, 1)
  }

  async function fetchFavoritesSchedules() {
    favoritesSchedules.value =
      (await favoritesStorage.getFavoriteSchedules(userId)) ?? []
  }

  return {
    favoritesSchedules,
    saveNewFavoriteSchedule,
    deleteFavoriteScheduleById,
    fetchFavoritesSchedules,
  }
}
