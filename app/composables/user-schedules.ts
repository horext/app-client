import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserSchedules = () => {
  const generationStore = useGenerationStore()
  const { loadSaved } = useGeneration()
  const { result } = storeToRefs(generationStore)

  async function updateSchedules(_schedules: IScheduleGenerate[]) {
    generationStore.updateSchedules(_schedules)
  }

  return {
    mySchedules: computed(() => result.value?.schedules ?? []),
    updateSchedules,
    fetchSchedules: loadSaved,
  }
}
