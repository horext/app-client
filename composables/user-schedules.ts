import { useCategorySchedules } from './user-category-schedule'

export const useUserSchedules = () => {
  const {
    categorySchedules: schedules,
    fetchCategorySchedules: fetchSchedules,
    saveNewScheduleToCategory: addSchedule,
    deleteScheduleFromCategoryById: deleteSchedule,
    uodateSchedulesFromCategory: updateSchedules,
  } = useCategorySchedules('GENERATED')


  return {
    schedules,
    fetchSchedules,
    addSchedule,
    deleteSchedule,
    updateSchedules,
  }
}