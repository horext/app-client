import { useCategorySchedules } from './user-category-schedule'

export const useUserSchedules = () => {
  const {
    categorySchedules: schedules,
    fetchSchedules: fetchSchedules,
    saveNewScheduleToCategory: addSchedule,
    deleteScheduleFromCategoryById: deleteSchedule,
    updateSchedulesInCategory: updateSchedules,
  } = useCategorySchedules('GENERATED')


  return {
    schedules,
    fetchSchedules,
    addSchedule,
    deleteSchedule,
    updateSchedules,
  }
}