import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '~/interfaces/schedule'

export const STORE_SCHEDULES = 'my-schedules'

export function updateAndCategorizeSchedules(
  incomingSchedules: IBaseScheduleGenerate[],
  currentSchedules: IScheduleGenerate[],
  categoryCode: 'GENERATED' | 'FAVORITE',
) {
  const incomingSchedulesMap = new Map(
    incomingSchedules.map((schedule) => [schedule.id, schedule]),
  )

  // Single pass through current schedules
  const generatedSchedules = new Map<
    IScheduleGenerate['id'],
    IScheduleGenerate
  >()

  // Process existing schedules
  for (const schedule of currentSchedules) {
    const incomingSchedule = incomingSchedulesMap.get(schedule.id)
    const hasCategory = schedule.categories.includes(categoryCode)

    if (incomingSchedule) {
      // Schedule exists in incoming and current
      if (!hasCategory) {
        // Add category if not present
        generatedSchedules.set(schedule.id, {
          ...schedule,
          categories: [...schedule.categories, categoryCode],
        })
      } else {
        // Keep unchanged
        generatedSchedules.set(schedule.id, schedule)
      }
      // Remove from incoming map to track new schedules
      incomingSchedulesMap.delete(schedule.id)
    } else if (hasCategory) {
      // Schedule only in current with category
      const newCategories = schedule.categories.filter(
        (c) => c !== categoryCode,
      )
      if (newCategories.length > 0) {
        generatedSchedules.set(schedule.id, {
          ...schedule,
          categories: newCategories,
        })
      }
    } else {
      // Keep unchanged
      generatedSchedules.set(schedule.id, schedule)
    }
  }

  // Add remaining new schedules
  for (const [, schedule] of incomingSchedulesMap) {
    generatedSchedules.set(schedule.id, {
      ...schedule,
      categories: [categoryCode],
    })
  }

  const consolidatedSchedules = Array.from(generatedSchedules.values())
  return consolidatedSchedules
}

export function appendScheduleToCategory(
  schedules: IScheduleGenerate[],
  schedule: IBaseScheduleGenerate,
  categoryCode: 'GENERATED' | 'FAVORITE',
) {
  return schedules.concat({
    ...schedule,
    categories: [categoryCode],
  })
}

export function mergeScheduleWithNewCategory(
  currentSchedules: IScheduleGenerate[],
  schedule: IBaseScheduleGenerate,
  categoryCode: 'GENERATED' | 'FAVORITE',
) {
  const foundSchedule = currentSchedules.find((s) => s.id === schedule.id)
  if (!foundSchedule) {
    return appendScheduleToCategory(currentSchedules, schedule, categoryCode)
  }
  if (!foundSchedule.categories.includes(categoryCode)) {
    const newSchedule = {
      ...foundSchedule,
      categories: foundSchedule.categories.concat(categoryCode),
    }
    return currentSchedules.map((s) => (s.id === schedule.id ? newSchedule : s))
  }
  return currentSchedules
}

export function excludeCategoryFromSchedule(
  currentSchedules: IScheduleGenerate[],
  id: string,
  categoryCode: 'GENERATED' | 'FAVORITE',
) {
  const schedule = currentSchedules.find((s) => s.id === id)
  if (schedule && schedule.categories.includes(categoryCode)) {
    const newSchedule = {
      ...schedule,
      categories: schedule.categories.filter((c) => c !== categoryCode),
    }
    if (newSchedule.categories.length === 0) {
      return currentSchedules.filter((s) => s.id !== id)
    } else {
      return currentSchedules.map((s) =>
        s.id === id ? newSchedule : s,
      )
    }
  }
  return currentSchedules
}

export function removeCategoryFromSchedule(
  currentSchedules: IScheduleGenerate[],
  schedule: IBaseScheduleGenerate,
  categoryCode: 'GENERATED' | 'FAVORITE',
) {
  const foundSchedule = currentSchedules.find((s) => s.id === schedule.id)
  if (foundSchedule && foundSchedule.categories.includes(categoryCode)) {
    const newSchedule = {
      ...foundSchedule,
      categories: foundSchedule.categories.filter((c) => c !== categoryCode),
    }
    if (newSchedule.categories.length === 0) {
      return currentSchedules.filter((s) => s.id !== schedule.id)
    } else {
      return currentSchedules.map((s) =>
        s.id === schedule.id ? newSchedule : s,
      )
    }
  }
  return currentSchedules
}

export const useCategorySchedules = (
  categoryCode: 'GENERATED' | 'FAVORITE',
) => {
  const storage = useLocalStorage<IScheduleGenerate[]>()
  const configStore = useUserConfigStore()
  const { schedules } = storeToRefs(configStore)

  const categorySchedules = computed(() =>
    schedules.value.filter((s) => s.categories.includes(categoryCode)),
  )

  async function saveNewScheduleToCategory(schedule: IBaseScheduleGenerate) {
    const updatedSchedules = appendScheduleToCategory(
      schedules.value,
      schedule,
      categoryCode,
    )
    schedules.value = updatedSchedules
    await storage.setItem(STORE_SCHEDULES, updatedSchedules)
  }

  async function deleteScheduleFromCategoryById(
    id: IBaseScheduleGenerate['id'],
  ) {
    const updatedSchedules = excludeCategoryFromSchedule(
      schedules.value,
      id,
      categoryCode,
    )
    await storage.setItem(STORE_SCHEDULES, updatedSchedules)
    schedules.value = updatedSchedules
  }

  const addScheduleToCategory = async (schedule: IBaseScheduleGenerate) => {
    const updatedSchedules = mergeScheduleWithNewCategory(
      schedules.value,
      schedule,
      categoryCode,
    )
    schedules.value = updatedSchedules
    await storage.setItem(STORE_SCHEDULES, updatedSchedules)
  }

  async function fetchSchedules() {
    const data =
      (await storage.getItem<IScheduleGenerate[]>(STORE_SCHEDULES)) || []
    schedules.value = data
  }

  const removeScheduleFromCategory = async (
    schedule: IBaseScheduleGenerate,
  ) => {
    const updatedSchedules = removeCategoryFromSchedule(
      schedules.value,
      schedule,
      categoryCode,
    )
    await storage.setItem(STORE_SCHEDULES, updatedSchedules)
    schedules.value = updatedSchedules
  }

  const updateSchedulesInCategory = async (
    incomingSchedules: IBaseScheduleGenerate[],
  ) => {
    const consolidatedSchedules = updateAndCategorizeSchedules(
      incomingSchedules,
      schedules.value,
      categoryCode,
    )

    // Batch update storage and state
    await storage.setItem(STORE_SCHEDULES, consolidatedSchedules)
    schedules.value = consolidatedSchedules
  }
  return {
    categorySchedules,
    saveNewScheduleToCategory,
    deleteScheduleFromCategoryById,
    addScheduleToCategory,
    fetchSchedules: fetchSchedules,
    removeScheduleFromCategory,
    updateSchedulesInCategory,
  }
}
