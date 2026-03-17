import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserSchedules = () => {
  const storage = useGeneratedSchedulesService()
  const configStore = useUserConfigStore()
  const { schedules } = storeToRefs(configStore)

  async function updateSchedules(_schedules: IScheduleGenerate[]) {
    schedules.value = _schedules
    await storage.saveGeneratedSchedules(_schedules)
  }

  async function fetchSchedules() {
    schedules.value = await storage.getGeneratedSchedules()
  }

  return {
    mySchedules: schedules,
    updateSchedules,
    fetchSchedules,
  }
}
