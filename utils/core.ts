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
  extends Pick<ISelectedSubject, 'id' | 'schedules' | 'course'> {}

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

function createIntersection(
  intersectionId: string,
  scheduleSubjectEvent: Event,
  restScheduleEvent: Event,
  type: string,
): IIntersectionOccurrence {
  return {
    id: intersectionId,
    name: `${scheduleSubjectEvent.title} - ${restScheduleEvent.title}`,
    eventTarget: scheduleSubjectEvent,
    eventSource: restScheduleEvent,
    type,
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
  const options = {
    credits: 100,
    crossingSubjects: 0,
    crossEvent: false,
    crossPractices: false,
    ..._options,
  }
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

  const schedulesCrossings: number[] = Array(totalSchedules).fill(0)
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
    let crossingCombination = 0
    let useCombination = true
    for (let j = 0; j < scheduleSubjects.length; j++) {
      const currentScheduleSubjectEvents = scheduleSubjectsEvents.shift()
      if (!currentScheduleSubjectEvents) continue

      for (const scheduleSubjectEvent of currentScheduleSubjectEvents) {
        const restScheduleScheduleEvents = scheduleSubjectsEvents.flat()

        restScheduleScheduleEvents.push(...baseEvents)
        let intersections = 0
        for (const restScheduleEvent of restScheduleScheduleEvents) {
          if (isIntersects(scheduleSubjectEvent, restScheduleEvent)) {
            const addEventToIntersection = (type: string) => {
              const intersectionId = generateIntersectionId(
                scheduleSubjectEvent,
                restScheduleEvent,
              )

              if (
                !intersectionOccurrences.find(
                  (o) => o.id === intersectionId && o.type === type,
                )
              ) {
                const intersectionOccurrence: IIntersectionOccurrence =
                  createIntersection(
                    intersectionId,
                    scheduleSubjectEvent,
                    restScheduleEvent,
                    type,
                  )
                intersectionOccurrences.push(intersectionOccurrence)
              }
            }
            // if have available crossings
            if (
              crossingCombination + intersections <=
              options.crossingSubjects
            ) {
              intersections++
            } else {
              if (
                (restScheduleEvent.type?.includes('P', 0) &&
                  scheduleSubjectEvent.type?.includes('P', 0) &&
                  !options.crossPractices) ||
                (restScheduleEvent.type?.includes('MY_EVENT', 0) &&
                  scheduleSubjectEvent.type?.includes('MY_EVENT', 0) &&
                  !options.crossEvent)
              ) {
                addEventToIntersection('CROSSING_NOT_AVAILABLE')
              } else {
                addEventToIntersection('CROSSING_EXCEEDED')
              }
              break
            }

            if (
              (restScheduleEvent.type?.includes('P', 0) &&
                scheduleSubjectEvent.type?.includes('P', 0) &&
                !options.crossPractices) ||
              (restScheduleEvent.type?.includes('MY_EVENT', 0) &&
                scheduleSubjectEvent.type?.includes('MY_EVENT', 0) &&
                !options.crossEvent)
            ) {
              addEventToIntersection('CROSSING_NOT_AVAILABLE')
              useCombination = false
            } else {
              addEventToIntersection('CROSSING_BASIS')
            }
          }
        }

        crossingCombination = crossingCombination + intersections
      }
    }
    if (crossingCombination <= options.crossingSubjects && useCombination) {
      schedulesCrossings[i] = crossingCombination
      const scheduleSubjectIds = scheduleSubjects.map(
        (c) => c.scheduleSubject.id,
      )
      schedules.push({
        id: scheduleSubjectIds.join(','),
        scheduleSubjectIds,
        schedule: scheduleSubjects,
        crossings: crossingCombination,
        events: convertScheduleSubjectToEvents(scheduleSubjects)
          .flat()
          .concat(baseEvents),
      })
    }

    incrementScheduleIndex(indexSchedules.length - 1)
  }

  return {
    combinations: schedules,
    occurrences: intersectionOccurrences,
  }
}
