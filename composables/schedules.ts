import type { IEvent } from '~/interfaces/event'
import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'
import type { IScheduleGenerate } from '~/interfaces/schedule'
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
      combinations: IScheduleGenerate[]
    }>((resolve, reject) => {
      worker.value?.addEventListener(
        'message',
        (e: MessageEvent<string>) => {
          if (!e.data) reject('Error al generar horarios')
          if (!worker.value) reject('Error al generar horarios')
          worker.value?.removeEventListener('message', () => {})
          resolve(JSON.parse(e.data))
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
      return getSchedules(subjects, myEvents, options)
    }
  }

  return { loadSchedules }
}
