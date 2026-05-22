import type { IBaseIntersectionOccurrence } from '~/interfaces/ocurrences'
import type {
  ILocalScheduleGenerate,
  IScheduleSubjectGenerate,
} from '~/interfaces/schedule'
import type { IBaseSubjectSchedules } from '~/interfaces/subject'
import type { IEvent } from '~/interfaces/event'
import { isIntersects } from './event'
import { EVENT_COLORS } from '~/constants/event'
import Event from '~/models/Event'
import { scheduleToEvents } from '~/utils/event'

export type ScheduleOptions = {
  credits?: number
  crossingSubjects: number
  crossEvent?: boolean
  crossPractices?: boolean
}

export function getSchedules(
  subjectsSchedules: Array<IBaseSubjectSchedules>,
  activities: Array<IEvent>,
  _options?: ScheduleOptions,
): {
  occurrences: IBaseIntersectionOccurrence[]
  combinations: ILocalScheduleGenerate[]
} {
  const options = {
    credits: 100,
    crossingSubjects: 0,
    crossEvent: false,
    crossPractices: false,
    ..._options,
  }
  const occurrencesMap = new Map<string, IBaseIntersectionOccurrence>()
  const maxQuantity = subjectsSchedules.length
  const indexSchedules: number[] = Array(maxQuantity).fill(0)
  const generatedSchedules: Array<ILocalScheduleGenerate> = []
  const baseEvents = activities.map(Event.buildFrom)

  const advanceIndex = (i: number) => {
    const subjectSchedules = subjectsSchedules[i]
    const currentIndex = indexSchedules[i]
    if (
      i >= 0 &&
      subjectSchedules &&
      currentIndex !== undefined &&
      currentIndex === subjectSchedules.schedules.length - 1
    ) {
      indexSchedules[i] = 0
      advanceIndex(i - 1)
    } else if (i >= 0 && currentIndex !== undefined) {
      indexSchedules[i] = currentIndex + 1
    }
  }

  const totalSchedules = subjectsSchedules.reduce(
    (total, ss) => {
      return total * ss.schedules.length
    },
    subjectsSchedules.length > 0 ? 1 : 0,
  )

  const schedulesCrossings: number[] = Array(totalSchedules).fill(0)
  for (let i = totalSchedules; i--; ) {
    const scheduleSubjects: Array<IScheduleSubjectGenerate> = []
    for (let j = 0; j < indexSchedules.length; j++) {
      const subjectSchedules = subjectsSchedules[j]
      if (!subjectSchedules) continue
      const scheduleIndex = indexSchedules[j]
      if (scheduleIndex === undefined) continue
      const schedule = subjectSchedules.schedules[scheduleIndex]
      if (!schedule) continue
      scheduleSubjects.push({
        ...schedule,
        subject: subjectSchedules.subject,
      })
    }
    const scheduleSubjectsEvents = scheduleSubjects.map((c, index) =>
      scheduleToEvents(c, EVENT_COLORS[index] ?? '#000000'),
    )
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
              const occurrenceKey = [
                scheduleSubjectEvent.id,
                restScheduleEvent.id,
              ]
                .sort()
                .join('-')
              const key = `${occurrenceKey}:${type}`
              if (!occurrencesMap.has(key)) {
                occurrencesMap.set(key, {
                  id: crypto.randomUUID(),
                  eventKey: occurrenceKey,
                  name: `${scheduleSubjectEvent.title} - ${restScheduleEvent.title}`,
                  eventTarget: scheduleSubjectEvent,
                  eventSource: restScheduleEvent,
                  type,
                })
              }
            }
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
      const scheduleSubjectKey = [...scheduleSubjectIds].sort().join(',')
      generatedSchedules.push({
        scheduleSubjectKey,
        scheduleSubjectIds,
        schedules: scheduleSubjects,
        crossings: crossingCombination,
        events: scheduleSubjects
          .map((c, index) =>
            scheduleToEvents(c, EVENT_COLORS[index] ?? '#000000'),
          )
          .flat()
          .concat(baseEvents),
      })
    }

    advanceIndex(indexSchedules.length - 1)
  }

  return {
    combinations: generatedSchedules,
    occurrences: Array.from(occurrencesMap.values()),
  }
}
