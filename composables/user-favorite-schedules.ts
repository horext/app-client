import { useCategorySchedules } from './user-category-schedule'

export const useUserFavoriteSchedules = () => {
  const {
    categorySchedules: favoritesSchedules,
    saveNewScheduleToCategory: saveNewFavoriteSchedule,
    deleteScheduleFromCategoryById: deleteFavoriteScheduleById,
    addScheduleToCategory: addFavoriteSchedule,
    fetchCategorySchedules: fetchFavoritesSchedules,
    removeScheduleFromCategory: removeFavoriteSchedule,
  } = useCategorySchedules('FAVORITE')

  return {
    favoritesSchedules,
    saveNewFavoriteSchedule,
    deleteFavoriteScheduleById,
    addFavoriteSchedule,
    fetchFavoritesSchedules,
    removeFavoriteSchedule,
  }
}