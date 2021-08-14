import { Event } from '~/types'

const isIntersects =
  (eventTarget: Event, eventSource: { start: string; end: string }): boolean =>
    !((eventTarget.end <= eventSource.start) || (eventSource.end <= eventTarget.start))

const convertToDate = (day: string | number, startTime: string) => {
  return obtenerDiaSemana(day).concat(startTime)
}
export { convertToDate }

export function getSchedules (
  subjects: Array<any>,
  myEvents: Array<any>,
  options:any = {
    credits: 100,
    crossingSubjects: 0,
    crossEvent: false,
    crossPractices: false
  }
): { occurrences: any[]; schedules: any[]; combinations: any[] } {
  const occurrences = []
  const quantitySubjects = subjects.length
  const maxQuantity = subjects.length
  const indexSchedules = Array(maxQuantity).fill(quantitySubjects === 1 ? subjects[0] : 0)
  if (quantitySubjects === 1) {
    console.log([indexSchedules])
  }
  const schedules: Array<any> = []
  const increment = (i: number) => {
    if (i >= 0 && (indexSchedules[i] === (subjects[i].schedules.length - 1))) {
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
  for (let i = combinations; i--;) {
    const combination: Array<any> = []
    for (let j = 0; j < indexSchedules.length; j++) {
      const subject = subjects[j]
      const schedule = subjects[j].schedules[indexSchedules[j]]
      combination.push({
        ...schedule,
        subject
      })
    }
    const currentSchedule = combination.map((c, index) => ({
      ...c,
      events: scheduleToEvent(c, colors[index])
    }))
    // calculating crossing
    let crossingCombination = 0
    for (let j = 0; j < combination.length; j++) {
      const schedule = currentSchedule.splice(0, 1)
      const events = schedule[0].events
      for (const event of events) {
        const otherEvents = currentSchedule.map((c: any) => c.events).flat()
        otherEvents.push(...myEvents)
        let intersections = 0
        for (const item of otherEvents) {
          if (isIntersects(event, item)) {
            if ((item.type?.includes('P', 0) && event.type?.includes('P', 0))) {
              if (crossingCombination + intersections <= options.crossingSubjects) {
                intersections++
              } else {
                occurrences.push({
                  type: 'Cruce de ' + event.title + ' - ' + item.title,
                  elementA: event,
                  elementB: item
                })
                break
              }
            } else {
              intersections++
            }
          }
        }

        crossingCombination = crossingCombination + intersections
      }
    }
    if ((crossingCombination) <= options.crossingSubjects) {
      crossings[i] = crossingCombination
      schedules.push({
        scheduleSubjectIds: combination.map(c => c.scheduleSubject.id),
        schedule: combination,
        crossings: crossingCombination,
        events: combination.map((c, index) => scheduleToEvent(c, colors[index])).flat().concat(myEvents)
      })
    }

    increment(indexSchedules.length - 1)
  }

  return {
    schedules: [],
    combinations: schedules,
    occurrences
  }
}

function scheduleToEvent (schedule: any, color: string = 'primary'): Array<any> {
  const events: Array<any> = []
  const sessions = schedule?.sessions || []
  for (let i = 0; i < sessions.length; i++) {
    const course = schedule.subject.course
    const section = schedule.section.id
    const event = {
      title: course.id + ' ' + section + ' ' + course.name,
      start: convertToDate(sessions[i].day, sessions[i].startTime),
      end: convertToDate(sessions[i].day, sessions[i].endTime),
      type: sessions[i].type.code,
      name: course.name,
      color,
      code: course.id + section,
      category: 'COURSE'
    }
    events.push(event)
  }
  return events
}

const weekDays = [
  {
    index: 0,
    value: 'Domingo',
    startDate: '2020-11-15'
  },
  {
    index: 1,
    value: 'Lunes',
    startDate: '2020-11-09'
  },
  {
    index: 2,
    value: 'Martes',
    startDate: '2020-11-10'
  },
  {
    index: 3,
    value: 'Miercoles',
    startDate: '2020-11-11'
  },
  {
    index: 4,
    value: 'Jueves',
    startDate: '2020-11-12'
  },
  {
    index: 5,
    value: 'Viernes',
    startDate: '2020-11-13'
  },
  {
    index: 6,
    value: 'Sábado',
    startDate: '2020-11-14'
  }
]
export { weekDays }

export const colors = ['indigo', 'deep-purple',
  'indigo darken-3', 'deep-purple darken-3', 'cyan darken-3',
  'cyan', 'green', 'orange', 'blue ',
  'indigo lighten-3', 'deep-purple lighten-3', 'cyan lighten-3',
  ' green darken-3', 'orange darken-3', 'blue darken-3',
  'green lighten-3', 'orange lighten-3', 'blue lighten-3'
]

const obtenerDiaSemana = (dia: string | number): string => {
  switch (dia) {
    case 1:
      return '2020-11-09 '
    case 2:
      return '2020-11-10 '
    case 3:
      return '2020-11-11 '
    case 4:
      return '2020-11-12 '
    case 5:
      return '2020-11-13 '
    case 6:
      return '2020-11-14 '
    case 0:
      return '2020-11-15 '
    default:
      return ''
  }
}

export const weekdays = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sábado'
]

export { obtenerDiaSemana }
