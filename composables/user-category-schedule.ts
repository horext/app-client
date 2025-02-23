import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '~/interfaces/schedule'

export const useCategorySchedules = (
  categoryCode: 'GENERATED' | 'FAVORITE',
) => {
  const storage = useLocalStorage<IScheduleGenerate[]>('user')
  const configStore = useUserConfigStore()
  const { schedules } = storeToRefs(configStore)

  const categorySchedules = computed(() =>
    schedules.value.filter((s) => s.categories.includes(categoryCode)),
  )

  async function saveNewScheduleToCategory(schedule: IBaseScheduleGenerate) {
    const updatedSchedules = schedules.value.concat({
      ...schedule,
      categories: [categoryCode],
    })
    schedules.value = updatedSchedules
    await storage.setItem('schedules', updatedSchedules)
  }

  async function deleteScheduleFromCategoryById(
    id: IBaseScheduleGenerate['id'],
  ) {
    const schedule = schedules.value.find((s) => s.id === id)
    if (schedule && schedule.categories.includes(categoryCode)) {
      const newSchedule = {
        ...schedule,
        categories: schedule.categories.filter((c) => c !== categoryCode),
      }
      if (newSchedule.categories.length === 0) {
        schedules.value = schedules.value.filter((s) => s.id !== id)
      } else {
        schedules.value = schedules.value.map((s) =>
          s.id === id ? newSchedule : s,
        )
      }
      await storage.setItem('mySchedules', schedules.value)
    }
  }

  const addScheduleToCategory = async (schedule: IBaseScheduleGenerate) => {
    const foundSchedule = schedules.value.find((s) => s.id === schedule.id)
    if (!foundSchedule) {
      return await saveNewScheduleToCategory(schedule)
    }
    if (!foundSchedule.categories.includes(categoryCode)) {
      const newSchedule = {
        ...foundSchedule,
        categories: foundSchedule.categories.concat(categoryCode),
      }
      schedules.value = schedules.value.map((s) =>
        s.id === schedule.id ? newSchedule : s,
      )
      await storage.setItem('mySchedules', schedules.value)
    }
  }

  async function fetchCategorySchedules() {
    const data =
      (await storage.getItem<IScheduleGenerate[]>('mySchedules')) || []
    schedules.value = data
  }

  const removeScheduleFromCategory = async (
    schedule: IBaseScheduleGenerate,
  ) => {
    const foundSchedule = schedules.value.find((s) => s.id === schedule.id)
    if (foundSchedule && foundSchedule.categories.includes(categoryCode)) {
      const newSchedule = {
        ...foundSchedule,
        categories: foundSchedule.categories.filter((c) => c !== categoryCode),
      }
      if (newSchedule.categories.length === 0) {
        schedules.value = schedules.value.filter((s) => s.id !== schedule.id)
      } else {
        schedules.value = schedules.value.map((s) =>
          s.id === schedule.id ? newSchedule : s,
        )
      }
      await storage.setItem('mySchedules', schedules.value)
    }
  }

  const uodateSchedulesFromCategory = async (
    incomingSchedules: IBaseScheduleGenerate[],
  ) => {
    // prevent duplicate schedules in the same category and id
    // if exists add category to the schedule if not add the schedule
    const updatedSchedules = schedules.value.map((s) => {
      const foundSchedule = incomingSchedules.find((sc) => sc.id === s.id)
      if (foundSchedule) {
        if (!s.categories.includes(categoryCode)) {
          return {
            ...s,
            categories: s.categories.concat(categoryCode),
          }
        }
      }
      return s
    })
    const newSchedules = incomingSchedules.filter(
      (s) => !schedules.value.find((sc) => sc.id === s.id),
    ).map((s) => ({ ...s, categories: [categoryCode] }))
    schedules.value = updatedSchedules.concat(newSchedules)
    await storage.setItem('mySchedules', schedules.value)
  }
  return {
    categorySchedules,
    saveNewScheduleToCategory,
    deleteScheduleFromCategoryById,
    addScheduleToCategory,
    fetchCategorySchedules,
    removeScheduleFromCategory,
    uodateSchedulesFromCategory,
  }
}
