import type { IActivity } from '~/interfaces/event'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { ILocalScheduleGenerate } from '~/interfaces/schedule'
import type {
  IBaseSubjectSchedules,
  ISubjectSchedule,
} from '~/interfaces/subject'
import CoreWorker from '@/assets/workers/core?worker'

export const useSchedulesGenerator = () => {
  const worker = shallowRef<Worker | null>(null)
  onMounted(() => {
    worker.value = new CoreWorker()
  })

  onUnmounted(() => {
    worker.value?.terminate()
  })

  const loadSchedulesViaWorker = (
    subjects: Array<IBaseSubjectSchedules>,
    myEvents: Array<IActivity>,
    options: ScheduleOptions,
  ) => {
    return new Promise<{
      occurrences: IIntersectionOccurrence[]
      schedules: ISubjectSchedule[]
      combinations: ILocalScheduleGenerate[]
    }>((resolve, reject) => {
      if (!worker.value) reject('Not loaded worker')
      worker.value?.addEventListener(
        'message',
        (
          e: MessageEvent<{
            occurrences: IIntersectionOccurrence[]
            schedules: ISubjectSchedule[]
            combinations: ILocalScheduleGenerate[]
          }>,
        ) => {
          if (!e.data) reject('No data')
          if (!worker.value) reject('Not found worker')
          worker.value?.removeEventListener('message', () => {})
          resolve(e.data)
        },
        false,
      )
      worker.value?.postMessage(JSON.stringify([subjects, myEvents, options]))
    })
  }

  const loadSchedules = (
    subjects: Array<IBaseSubjectSchedules>,
    myEvents: Array<IActivity>,
    options: ScheduleOptions,
  ) => {
    try {
      return loadSchedulesViaWorker(subjects, myEvents, options)
    } catch (error) {
      console.error(error)
      return getSchedules(subjects, myEvents, options)
    }
  }

  return { loadSchedules }
}
