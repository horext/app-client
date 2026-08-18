import type { ISubject } from '~/interfaces/subject'
import type { ILocalHourlyLoadDataset } from '#shared/domain/types/local-hourly-load'

const dataset = shallowRef<ILocalHourlyLoadDataset>()
const loaded = ref(false)
let loadedUserId: string | undefined

export const useLocalHourlyLoad = () => {
  const service = useLocalHourlyLoadService()
  const userId = useSchedulesUserId()
  const ensureLoaded = async () => {
    if (!loaded.value || loadedUserId !== userId) {
      dataset.value = await service.get(userId)
      loaded.value = true
      loadedUserId = userId
    }
    return dataset.value
  }

  const activate = async (value: ILocalHourlyLoadDataset) => {
    await service.activate(userId, value)
    dataset.value = value
    loaded.value = true
    loadedUserId = userId
  }

  const clear = async () => {
    await service.clear(userId)
    dataset.value = undefined
    loaded.value = true
    loadedUserId = userId
  }

  const searchSubjects = async (search: string): Promise<ISubject[]> => {
    const current = await ensureLoaded()
    if (!current) return []
    const normalize = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es')
    const query = normalize(search.trim())
    if (!query) return []
    return current.subjects
      .filter(
        (subject) =>
          normalize(subject.course.id).includes(query) ||
          normalize(subject.course.name).includes(query),
      )
      .slice(0, 50)
  }

  const schedulesForSubject = async (subjectId: number) => {
    const current = await ensureLoaded()
    return current?.schedulesBySubject[String(subjectId)] ?? []
  }

  return {
    dataset: readonly(dataset),
    ensureLoaded,
    activate,
    clear,
    searchSubjects,
    schedulesForSubject,
  }
}
