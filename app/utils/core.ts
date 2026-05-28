import type { IBaseIntersectionOccurrence } from '~/interfaces/ocurrences'
import type {
  ILocalScheduleGenerate,
  IScheduleSubjectGenerate,
} from '~/interfaces/schedule'
import type { IBaseSubjectSchedules } from '~/interfaces/subject'
import type { IActivity } from '~/interfaces/event'
import { EVENT_COLORS } from '~/constants/event'
import { Activity, CourseEvent, EventCategory } from '~/models/Event'
import type { UUID } from 'crypto'

export type ScheduleOptions = {
  credits?: number
  crossingSubjects: number
  crossActivities?: boolean
  crossPractices?: boolean
}

export function getSchedules(
  subjectsSchedules: Array<IBaseSubjectSchedules>,
  activities: Array<IActivity>,
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
  const baseEvents = activities.map(Activity.buildActivityFrom)

  const advanceIndex = (start: number) => {
    let i = start
    while (i >= 0) {
      const currentIndex = indexSchedules[i]!
      if (currentIndex === subjectsSchedules[i]!.schedules.length - 1) {
        indexSchedules[i] = 0
        i--
      } else {
        indexSchedules[i] = currentIndex + 1
        break
      }
    }
  }

  const totalSchedules = subjectsSchedules.reduce(
    (total, ss) => {
      return total * ss.schedules.length
    },
    subjectsSchedules.length > 0 ? 1 : 0,
  )

  const intersectionCache = new Map<string, boolean>()
  for (let i = totalSchedules; i--; ) {
    const scheduleSubjects: Array<IScheduleSubjectGenerate> =
      subjectsSchedules.map((subjectSchedules, j) => ({
        ...subjectSchedules.schedules[indexSchedules[j]!]!,
        subject: subjectSchedules.subject,
      }))
    const scheduleSubjectsEvents = scheduleSubjects.map((c, index) =>
      CourseEvent.buildFromSchedule(c, EVENT_COLORS[index] ?? '#000000'),
    )
    let crossingCombination = 0
    let useCombination = true
    for (let j = 0; j < scheduleSubjectsEvents.length; j++) {
      const currentScheduleSubjectEvents = scheduleSubjectsEvents[j]!
      const restScheduleScheduleEvents: Array<CourseEvent | Activity<UUID>> =
        scheduleSubjectsEvents
          .slice(j + 1)
          .flat<Array<CourseEvent | Activity<UUID>>[]>()
          .concat(baseEvents)

      for (const scheduleSubjectEvent of currentScheduleSubjectEvents) {
        let intersections = 0
        for (const restScheduleEvent of restScheduleScheduleEvents) {
          if (scheduleSubjectEvent.day !== restScheduleEvent.day) continue
          const a = scheduleSubjectEvent.id
          const b = restScheduleEvent.id
          const occurrenceKey = a < b ? `${a}-${b}` : `${b}-${a}`
          let doesIntersect = intersectionCache.get(occurrenceKey)
          if (doesIntersect === undefined) {
            doesIntersect = scheduleSubjectEvent.intersects(restScheduleEvent)
            intersectionCache.set(occurrenceKey, doesIntersect)
          }
          if (doesIntersect) {
            const addOccurrence = (type: string) => {
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
            const activityRestriction =
              !options.crossActivities &&
              ((restScheduleEvent.category === EventCategory.MY_EVENT &&
                restScheduleEvent.isCrossTypeRestricted) ||
                (scheduleSubjectEvent.category === EventCategory.MY_EVENT &&
                  scheduleSubjectEvent.isCrossTypeRestricted))
            const practiceRestriction =
              !options.crossPractices &&
              restScheduleEvent.category === EventCategory.COURSE &&
              scheduleSubjectEvent.category === EventCategory.COURSE &&
              restScheduleEvent.isCrossTypeRestricted &&
              scheduleSubjectEvent.isCrossTypeRestricted
            const notAvailable = activityRestriction || practiceRestriction
            if (
              crossingCombination + intersections <=
              options.crossingSubjects
            ) {
              intersections++
            } else {
              addOccurrence(
                notAvailable ? 'CROSSING_NOT_AVAILABLE' : 'CROSSING_EXCEEDED',
              )
              break
            }
            if (notAvailable) {
              addOccurrence('CROSSING_NOT_AVAILABLE')
              useCombination = false
            } else {
              addOccurrence('CROSSING_BASIS')
            }
          }
        }

        crossingCombination = crossingCombination + intersections
      }
    }
    if (crossingCombination <= options.crossingSubjects && useCombination) {
      const scheduleSubjectIds = scheduleSubjects.map(
        (c) => c.scheduleSubject.id,
      )
      const scheduleSubjectKey = scheduleSubjectIds.sort().join(',')
      generatedSchedules.push({
        scheduleSubjectKey,
        schedulesSubject: scheduleSubjects,
        crossings: crossingCombination,
        events: scheduleSubjectsEvents
          .flat<Array<CourseEvent | Activity<UUID>>[]>()
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
