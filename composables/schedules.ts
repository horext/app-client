import type { IEvent } from '~/interfaces/event'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IBaseScheduleGenerate } from '~/interfaces/schedule'
import type { ISelectedSubject, ISubjectSchedule } from '~/interfaces/subject'
import CoreWorker from '@/assets/workers/core?worker'

export const useSchedules = () => {
  const worker = ref<Worker | null>(null)
  onMounted(() => {
    worker.value = new CoreWorker()
  })

  onUnmounted(() => {
    worker.value?.terminate()
  })

  const loadSchedulesViaWorker = (
    subjects: Array<ISelectedSubject>,
    myEvents: Array<IEvent>,
    options: ScheduleOptions,
  ) => {
    return new Promise<{
      occurrences: IIntersectionOccurrence[]
      schedules: ISubjectSchedule[]
      combinations: IBaseScheduleGenerate[]
    }>((resolve, reject) => {
      if (!worker.value) reject('Not loaded worker')
      worker.value?.addEventListener(
        'message',
        (
          e: MessageEvent<{
            occurrences: IIntersectionOccurrence[]
            schedules: ISubjectSchedule[]
            combinations: IBaseScheduleGenerate[]
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
    subjects: Array<ISelectedSubject>,
    myEvents: Array<IEvent>,
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
