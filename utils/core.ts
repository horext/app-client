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
    crossEvent: true,
    crossPractices: false,
    ..._options,
  }
  const occurrences: IIntersectionOccurrence[] = []
  const maxQuantity = subjects.length
  const indexSchedules: number[] = Array(maxQuantity).fill(0)
  const schedules: Array<IScheduleGenerate> = []
  const baseEvents = myEvents.map(Event.buildFrom)

  const advanceIndex = (i: number) => {
    if (i >= 0 && indexSchedules[i] === subjects[i].schedules.length - 1) {
      indexSchedules[i] = 0
      advanceIndex(i - 1)
    } else {
      indexSchedules[i]++
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
    const scheduleSubjectsEvents = scheduleSubjects.map((c, index) =>
      scheduleToEvent(c, EVENT_COLORS[index]),
    )
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
              const occurrence: IIntersectionOccurrence = {
                id: [scheduleSubjectEvent.id, restScheduleEvent.id]
                  .sort()
                  .join('-'),
                name: `${scheduleSubjectEvent.title} - ${restScheduleEvent.title}`,
                eventTarget: scheduleSubjectEvent,
                eventSource: restScheduleEvent,
                type,
              }
              if (
                !occurrences.find(
                  (o) => o.id === occurrence.id && o.type === type,
                )
              )
                occurrences.push(occurrence)
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
        events: scheduleSubjects
          .map((c, index) => scheduleToEvent(c, EVENT_COLORS[index]))
          .flat()
          .concat(baseEvents),
      })
    }

    advanceIndex(indexSchedules.length - 1)
  }

  return {
    combinations: schedules,
    occurrences,
  }
}
