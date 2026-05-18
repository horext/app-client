import type { IScheduleGenerate } from '~/interfaces/schedule'

export const useUserSchedules = () => {
  const generationStore = useGenerationStore()
  const { result } = storeToRefs(generationStore)

  async function updateSchedules(_schedules: IScheduleGenerate[]) {
    if (generationStore.result) {
      generationStore.result.schedules = _schedules
    }
  }

  async function fetchSchedules() {
    await generationStore.loadSaved()
  }

  return {
    mySchedules: computed(() => result.value?.schedules ?? []),
    updateSchedules,
    fetchSchedules,
  }
}
