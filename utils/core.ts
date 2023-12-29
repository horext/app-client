import { DateTime } from 'luxon'
import type { ISchedule } from '~/interfaces/schedule'
import type { ISelectedSubject, ISubjectSchedule } from '~/interfaces/subject'
import Event from '~/model/Event'

const isIntersects = (
  eventTarget: Event,
  eventSource: { start: string; end: string }
): boolean =>
  !(
    eventTarget.end <= eventSource.start || eventSource.end <= eventTarget.start
  )

export const weekdayToDatetime = (weekday: number, time: string) => {
  const date = DateTime.fromISO(time).set({ weekday })
  return date.toFormat('yyyy-MM-dd HH:mm')
}

export const weekdayToDate = (weekday: number) => {
  const date = DateTime.local().set({ weekday })
  return date.toFormat('yyyy-MM-dd')
}
export const convertToDate = (day: string | number, startTime: string) => {
  return weekdayToDatetime(<number>day, startTime)
}

export type ScheduleOptions = {
  credits?: number
  crossingSubjects: number
  crossEvent?: boolean
  crossPractices?: boolean
}

export function getSchedules(
  subjects: Array<ISelectedSubject>,
  myEvents: Array<Event>,
  options: ScheduleOptions = {
    credits: 100,
    crossingSubjects: 0,
    crossEvent: true,
    crossPractices: false,
  }
): { occurrences: any[]; schedules: any[]; combinations: ISchedule[] } {
  const occurrences = []
  const maxQuantity = subjects.length
  const indexSchedules = Array(maxQuantity).fill(0)
  const schedules: Array<ISchedule> = []

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
    const combination: Array<any> = []
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
      events: scheduleToEvent(c, colors[index]),
    }))
    // calculating crossing
    let crossingCombination = 0
    let useCombination = true
    for (let j = 0; j < combination.length; j++) {
      const schedule = currentSchedule.splice(0, 1)
      const events = schedule[0].events
      for (const event of events) {
        const otherEvents = currentSchedule.map((c: any) => c.events).flat()
        otherEvents.push(...myEvents)
        let intersections = 0
        for (const item of otherEvents) {
          if (isIntersects(event, item)) {
            occurrences.push({
              type: 'Cruce de ' + event.title + ' - ' + item.title,
              elementA: event,
              elementB: item,
            })
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
          .map((c, index) => scheduleToEvent(c, colors[index]))
          .flat()
          .concat(myEvents),
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
  color = 'primary'
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
      'COURSE',
      sessions[i].type.code
    )
    events.push(event)
  }
  return events
}

const weekDays = [
  {
    index: 0,
    value: 'Domingo',
    startDate: '2020-11-15',
  },
  {
    index: 1,
    value: 'Lunes',
    startDate: '2020-11-09',
  },
  {
    index: 2,
    value: 'Martes',
    startDate: '2020-11-10',
  },
  {
    index: 3,
    value: 'Miercoles',
    startDate: '2020-11-11',
  },
  {
    index: 4,
    value: 'Jueves',
    startDate: '2020-11-12',
  },
  {
    index: 5,
    value: 'Viernes',
    startDate: '2020-11-13',
  },
  {
    index: 6,
    value: 'Sábado',
    startDate: '2020-11-14',
  },
]
export { weekDays }

export const colors = [
  'indigo',
  'deep-purple',
  'indigo darken-3',
  'deep-purple darken-3',
  'cyan darken-3',
  'cyan',
  'green',
  'orange',
  'blue ',
  'indigo lighten-3',
  'deep-purple lighten-3',
  'cyan lighten-3',
  ' green darken-3',
  'orange darken-3',
  'blue darken-3',
  'green lighten-3',
  'orange lighten-3',
  'blue lighten-3',
]

export const weekdays = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sábado',
]
