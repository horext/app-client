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
  options: ScheduleOptions = {
    credits: 100,
    crossingSubjects: 0,
    crossEvent: true,
    crossPractices: false,
  },
): {
  occurrences: IIntersectionOccurrence[]
  combinations: IScheduleGenerate[]
} {
  const occurrences: IIntersectionOccurrence[] = []
  const maxQuantity = subjects.length
  const indexSchedules: number[] = Array(maxQuantity).fill(0)
  const schedules: Array<IScheduleGenerate> = []
  const baseEvents = myEvents.map(Event.buildFrom)

  const increment = (i: number) => {
    if (i >= 0 && indexSchedules[i] === subjects[i].schedules.length - 1) {
      indexSchedules[i] = 0
      increment(i - 1)
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
    const currentScheduleSubject = scheduleSubjects.map((c, index) => ({
      ...c,
      events: scheduleToEvent(c, EVENT_COLORS[index]),
    }))
    // calculating crossing
    let crossingCombination = 0
    let useCombination = true
    for (let j = 0; j < scheduleSubjects.length; j++) {
      const schedule = currentScheduleSubject.splice(0, 1)
      const events = schedule[0].events

      for (const event of events) {
        const otherEvents = currentScheduleSubject.map((c) => c.events).flat()

        otherEvents.push(...baseEvents)
        let intersections = 0
        for (const item of otherEvents) {
          if (isIntersects(event, item)) {
            const addEventToIntersection = (type: string) => {
              const occurrence: IIntersectionOccurrence = {
                id: [event.id, item.id].sort().join('-'),
                name: `${event.title} - ${item.title}`,
                eventTarget: event,
                eventSource: item,
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
                (item.type?.includes('P', 0) &&
                  event.type?.includes('P', 0) &&
                  !options.crossPractices) ||
                (item.type?.includes('MY_EVENT', 0) &&
                  event.type?.includes('MY_EVENT', 0) &&
                  !options.crossEvent)
              ) {
                addEventToIntersection('CROSSING_NOT_AVAILABLE')
              } else {
                addEventToIntersection('CROSSING_EXCEEDED')
              }
              break
            }

            if (
              (item.type?.includes('P', 0) &&
                event.type?.includes('P', 0) &&
                !options.crossPractices) ||
              (item.type?.includes('MY_EVENT', 0) &&
                event.type?.includes('MY_EVENT', 0) &&
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
      schedules.push({
        id: scheduleSubjects.map((c) => c.scheduleSubject.id).join(','),
        scheduleSubjectIds: scheduleSubjects.map(
          (c) => c.scheduleSubject.id,
        ),
        schedule: scheduleSubjects,
        crossings: crossingCombination,
        events: scheduleSubjects
          .map((c, index) => scheduleToEvent(c, EVENT_COLORS[index]))
          .flat()
          .concat(baseEvents),
      })
    }

    increment(indexSchedules.length - 1)
  }

  return {
    combinations: schedules,
    occurrences,
  }
}
