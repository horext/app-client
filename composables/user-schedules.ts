import type { IScheduleGenerate } from '~/interfaces/schedule'
import { useRuntimeConfig } from '#imports'

export const useUserSchedules = () => {
  const storage = useLocalStorage()
  const configStore = useUserConfigStore()
  const { schedules } = storeToRefs(configStore)
  const { public: { preferOfflineSave } } = useRuntimeConfig()

  async function updateSchedules(_schedules: IScheduleGenerate[]) {
    schedules.value = _schedules
    await storage.setItem('mySchedules', schedules.value)
    if (!preferOfflineSave) {
      await $fetch('/api/schedules', {
        method: 'POST',
        body: _schedules,
      })
    }
  }

  async function fetchSchedules() {
    if (preferOfflineSave) {
      const data =
        (await storage.getItem<IScheduleGenerate[]>('mySchedules')) || []
      const _schedules: IScheduleGenerate[] = data || []
      schedules.value = _schedules
    } else {
      const data = await $fetch<IScheduleGenerate[]>('/api/schedules')
      schedules.value = data || []
    }
  }

  async function deleteScheduleById(id: IScheduleGenerate['id']) {
    const index = schedules.value.findIndex((s) => s.id === id)
    schedules.value.splice(index, 1)
    await storage.setItem('mySchedules', schedules.value)
    if (!preferOfflineSave) {
      await $fetch(`/api/schedules/${id}`, {
        method: 'DELETE',
      })
    }
  }

  return {
    mySchedules: schedules,
    updateSchedules,
    fetchSchedules,
    deleteScheduleById,
  }
}
