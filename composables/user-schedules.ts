import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserSchedules = () => {
  const storage = useLocalStorage()
  const configStore = useUserConfigStore()
  const { schedules } = storeToRefs(configStore)

  async function updateSchedules(_schedules: IScheduleGenerate[]) {
    schedules.value = _schedules
    await storage.setItem('mySchedules', schedules.value)
  }

  async function fetchSchedules() {
    const data =
      (await storage.getItem<IScheduleGenerate[]>('mySchedules')) || []
    const _schedules: IScheduleGenerate[] = data || []
    schedules.value = _schedules
  }

  return {
    mySchedules: schedules,
    updateSchedules,
    fetchSchedules,
  }
}
