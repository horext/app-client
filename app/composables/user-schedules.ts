import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserSchedules = () => {
  const generationStore = useGenerationStore()
  const { loadSaved } = useGeneration()
  const { result } = storeToRefs(generationStore)

  async function updateSchedules(_schedules: IScheduleGenerate[]) {
    if (result.value) {
      result.value.schedules = _schedules
    }
  }

  return {
    mySchedules: computed(() => result.value?.schedules ?? []),
    updateSchedules,
    fetchSchedules: loadSaved,
  }
}
