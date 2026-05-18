import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserSchedules = () => {
  const generationStore = useGenerationStore()
  const { schedules } = storeToRefs(generationStore)

  async function updateSchedules(_schedules: IScheduleGenerate[]) {
    generationStore.schedules = _schedules
  }

  async function fetchSchedules() {
    await generationStore.loadSaved()
  }

  return {
    mySchedules: schedules,
    updateSchedules,
    fetchSchedules,
  }
}

