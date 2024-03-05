import type { IOccurrence } from '~/interfaces/ocurrences'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import type { ISelectedSubject, ISubjectSchedule } from '~/interfaces/subject'
import type { IEvent } from '~/interfaces/event'
import { isIntersects } from './event'
import { EVENT_COLORS } from '~/constants/event'
import Event from '~/models/Event'

export type ScheduleOptions = {
  credits?: number
  crossingSubjects: number
  crossEvent?: boolean
  crossPractices?: boolean
}

export function getSchedules(
  subjects: Array<ISelectedSubject>,
  myEvents: Array<IEvent>,
  options: ScheduleOptions = {
    credits: 100,
    crossingSubjects: 0,
    crossEvent: true,
    crossPractices: false,
  },
): {
  occurrences: IOccurrence[]
  schedules: ISubjectSchedule[]
  combinations: IScheduleGenerate[]
} {
  const occurrences: IOccurrence[] = []
  const maxQuantity = subjects.length
  const indexSchedules: number[] = Array(maxQuantity).fill(0)
  const schedules: Array<IScheduleGenerate> = []

  const increment = (i: number) => {
    if (i >= 0 && indexSchedules[i] === subjects[i].schedules.length - 1) {
      indexSchedules[i] = 0
      increment(i - 1)
    } else {
      indexSchedules[i]++
    }
  }

  const combinations = subjects.reduce((previousValue, currentValue) => {
    return previousValue * currentValue.schedules.length
  }, 1)
  const crossings = Array(combinations).fill(0)
  for (let i = combinations; i--; ) {
    const combination: Array<ISubjectSchedule> = []
    for (let j = 0; j < indexSchedules.length; j++) {
      const subject = subjects[j]
      const schedule = subjects[j].schedules[indexSchedules[j]]
      combination.push({
        ...schedule,
        subject,
      })
    }
    const currentSchedule = combination.map((c, index) => ({
      ...c,
      events: scheduleToEvent(c, EVENT_COLORS[index]),
    }))
    // calculating crossing
    let crossingCombination = 0
    let useCombination = true
    for (let j = 0; j < combination.length; j++) {
      const schedule = currentSchedule.splice(0, 1)
      const events = schedule[0].events.map(Event.buildFrom)

      for (const event of events) {
        const otherEvents = currentSchedule
          .map((c) => c.events)
          .flat()
          .map(Event.buildFrom)
        otherEvents.push(...myEvents.map(Event.buildFrom))
        let intersections = 0
        for (const item of otherEvents) {
          if (isIntersects(event, item)) {
            const occurrence: IOccurrence = {
              type: 'Cruce de ' + event.title + ' - ' + item.title,
              elementA: event,
              elementB: item,
            }
            occurrences.push(occurrence)
            // if have available crossings
            if (
              crossingCombination + intersections <=
              options.crossingSubjects
            ) {
              intersections++
            } else {
              break
            }
            // if is cross practice to practice
            if (
              item.type?.includes('P', 0) &&
              event.type?.includes('P', 0) &&
              !options.crossPractices
            ) {
              useCombination = false
            } else if (
              item.type?.includes('MY_EVENT', 0) &&
              event.type?.includes('MY_EVENT', 0) &&
              !options.crossEvent
            ) {
              useCombination = false
            }
          }
        }

        crossingCombination = crossingCombination + intersections
      }
    }
    if (crossingCombination <= options.crossingSubjects && useCombination) {
      crossings[i] = crossingCombination
      schedules.push({
        id: combination.map((c) => c.scheduleSubject.id).join(','),
        scheduleSubjectIds: combination.map((c) => c.scheduleSubject.id),
        schedule: combination,
        crossings: crossingCombination,
        events: combination
          .map((c, index) => scheduleToEvent(c, EVENT_COLORS[index]))
          .flat()
          .concat(myEvents.map(Event.buildFrom)),
      })
    }

    increment(indexSchedules.length - 1)
  }

  return {
    schedules: [],
    combinations: schedules,
    occurrences,
  }
}

function scheduleToEvent(
  schedule: ISubjectSchedule,
  color: string,
): Array<Event> {
  const events: Array<Event> = []
  const sessions = schedule?.sessions || []
  for (let i = 0; i < sessions.length; i++) {
    const course = schedule.subject.course
    const section = schedule.section.id
    const event = new Event(
      sessions[i].day,
      sessions[i].startTime,
      sessions[i].endTime,
      course.id + ' ' + section + ' - ' + course.name,
      ` Docente: ${sessions[i]?.teacher?.fullName}\n Curso: ${course.id} - ${course.name}\n Sección: ${section}`,
      sessions[i]?.classroom?.code,
      color,
      sessions[i].type.code,
      'COURSE',
    )
    events.push(event)
  }
  return events
}
