import type { IIntersectionOccurrence } from '~/interfaces/ocurrences'
import type {
  IScheduleGenerate,
  IScheduleSubjectGenerate,
} from '~/interfaces/schedule'
import type { ISelectedSubject } from '~/interfaces/subject'
import type { IEvent } from '~/interfaces/event'
import { isIntersects } from './event'
import { EVENT_COLORS } from '~/constants/event'
import Event from '~/models/Event'
import { scheduleToEvent } from '~/utils/event'

export type ScheduleOptions = {
  credits?: number
  crossingSubjects: number
  crossEvent?: boolean
  crossPractices?: boolean
}

export interface ISubjectEntry
  extends Pick<ISelectedSubject, 'id' | 'schedules' | 'course' | 'credits'> {}

function generateIntersectionId(
  scheduleSubjectEvent: Event,
  restScheduleEvent: Event,
) {
  return [scheduleSubjectEvent.id, restScheduleEvent.id].sort().join('-')
}

function convertScheduleSubjectToEvents(
  scheduleSubjects: IScheduleSubjectGenerate[],
) {
  return scheduleSubjects.map((c, index) =>
    scheduleToEvent(c, EVENT_COLORS[index]),
  )
}

function generateIntersectionOccurrences(
  scheduleSubjects: IScheduleSubjectGenerate[],
  scheduleSubjectsEvents: Event[][],
  baseEvents: Event[],
  globalOccurrences: IIntersectionOccurrence[],
) {
  const occurrences: IIntersectionOccurrence[] = []
  for (let j = 0; j < scheduleSubjects.length; j++) {
    const currentScheduleSubjectEvents = scheduleSubjectsEvents.shift()
    if (!currentScheduleSubjectEvents) continue

    for (const scheduleSubjectEvent of currentScheduleSubjectEvents) {
      const restScheduleScheduleEvents = scheduleSubjectsEvents.flat()

      restScheduleScheduleEvents.push(...baseEvents)
      for (const restScheduleEvent of restScheduleScheduleEvents) {
        if (isIntersects(scheduleSubjectEvent, restScheduleEvent)) {
          const addEventToIntersection = (type: string, category: string) => {
            const intersectionId = generateIntersectionId(
              scheduleSubjectEvent,
              restScheduleEvent,
            )

            if (!globalOccurrences.find((o) => o.id === intersectionId)) {
              globalOccurrences.push(
                createIntersection(
                  intersectionId,
                  scheduleSubjectEvent,
                  restScheduleEvent,
                  type,
                  category,
                ),
              )
            }
            if (!occurrences.find((o) => o.id === intersectionId)) {
              occurrences.push(
                createIntersection(
                  intersectionId,
                  scheduleSubjectEvent,
                  restScheduleEvent,
                  type,
                  category,
                ),
              )
            }
          }

          addEventToIntersection(
            `CROSSING_${[restScheduleEvent.type, scheduleSubjectEvent.type]
              .sort()
              .join('_')}`,
            `CROSSING_${[
              restScheduleEvent.category,
              scheduleSubjectEvent.category,
            ]
              .sort()
              .join('_')}`,
          )
        }
      }
    }
  }
  return occurrences
}

function createIntersection(
  intersectionId: string,
  scheduleSubjectEvent: Event,
  restScheduleEvent: Event,
  type: string,
  category: string,
): IIntersectionOccurrence {
  return {
    id: intersectionId,
    name: `${scheduleSubjectEvent.title} - ${restScheduleEvent.title}`,
    eventTarget: scheduleSubjectEvent,
    eventSource: restScheduleEvent,
    type,
    category,
  }
}

export function getSchedules(
  subjects: Array<ISubjectEntry>,
  myEvents: Array<IEvent>,
  _options?: ScheduleOptions,
): {
  occurrences: IIntersectionOccurrence[]
  combinations: IScheduleGenerate[]
} {
  const intersectionOccurrences: IIntersectionOccurrence[] = []
  const maxQuantity = subjects.length
  const indexSchedules: number[] = Array(maxQuantity).fill(0)
  const schedules: Array<IScheduleGenerate> = []
  const baseEvents = myEvents.map(Event.buildFrom)

  const incrementScheduleIndex = (currentIndex: number) => {
    if (
      currentIndex >= 0 &&
      indexSchedules[currentIndex] ===
        subjects[currentIndex].schedules.length - 1
    ) {
      indexSchedules[currentIndex] = 0
      incrementScheduleIndex(currentIndex - 1)
    } else {
      indexSchedules[currentIndex]++
    }
  }

  const totalSchedules = subjects.reduce(
    (total, subject) => {
      return total * subject.schedules.length
    },
    subjects.length > 0 ? 1 : 0,
  )

  for (let i = totalSchedules; i--; ) {
    const scheduleSubjects: Array<IScheduleSubjectGenerate> = []
    for (let j = 0; j < indexSchedules.length; j++) {
      const subject = subjects[j]
      const schedule = subject.schedules[indexSchedules[j]]
      scheduleSubjects.push({
        ...schedule,
        subject,
      })
    }
    const scheduleSubjectsEvents =
      convertScheduleSubjectToEvents(scheduleSubjects)
    // calculating crossing
    const occurrences = generateIntersectionOccurrences(
      scheduleSubjects,
      scheduleSubjectsEvents,
      baseEvents,
      intersectionOccurrences,
    )

    const scheduleSubjectIds = scheduleSubjects.map((c) => c.scheduleSubject.id)
    schedules.push({
      id: scheduleSubjectIds.join(','),
      scheduleSubjectIds,
      schedule: scheduleSubjects,
      intersections: {
        occurrences,
        typeStats: occurrences.reduce<{ count: number; type: string }[]>(
          (acc, o) => {
            const type = o.type
            const index = acc.findIndex((a) => a.type === type)
            if (index === -1) {
              acc.push({ count: 1, type })
            } else {
              acc[index].count++
            }
            return acc
          },
          [],
        ),
        categoryStats: occurrences.reduce<
          { count: number; category: string }[]
        >((acc, o) => {
          const category = o.category
          const index = acc.findIndex((a) => a.category === category)
          if (index === -1) {
            acc.push({ count: 1, category })
          } else {
            acc[index].count++
          }
          return acc
        }, []),
      },
      crossings: 0,
      totalCredits: scheduleSubjects.reduce(
        (total, subject) => total + subject.subject.credits,
        0,
      ),
      events: convertScheduleSubjectToEvents(scheduleSubjects)
        .flat()
        .concat(baseEvents),
    })
    incrementScheduleIndex(indexSchedules.length - 1)
  }

  return {
    combinations: schedules,
    occurrences: intersectionOccurrences,
  }
}
