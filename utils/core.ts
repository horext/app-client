import { Course, Event, Section } from '~/types'

const notIntersects =
  (eventTarget: Event, eventSource: { start: string; end: string }): boolean =>
    (eventTarget.end <= eventSource.start) || (eventSource.end <= eventTarget.start)

const isIntersects =
  (eventTarget: Event, eventSource: { start: string; end: string }): boolean =>
    !((eventTarget.end <= eventSource.start) || (eventSource.end <= eventTarget.start))

const quantityIntersections = (event: Event, events: Array<Event>, maxIntersections: number = -1) => {
  let intersections = 0
  for (let i = 0; i < events.length; i++) {
    if (isIntersects(event, events[i])) {
      intersections++
    }
    if (!!maxIntersections && intersections <= maxIntersections) {
      break
    }
  }
  return intersections
}
const convertToDate = (day: string | number, startTime: string) => {
  return obtenerDiaSemana(day).concat(startTime)
}
export { convertToDate }

export function generate
(cursos: Array<any>, eventos: Array<any>,
  crucesCursos: number = 0,
  cruzarEventos: boolean = false,
  crossesPractices: boolean = false
):
  { schedules: Array<any>; ocurrences: Array<any> } {
  const classSessions: Array<any> = []
  const i = 0
  const numCursos = 0
  const numCruces = 0
  const ocurrences = new Set()
  const options: any = {
    numberCrosses: 0,
    crossTasks: false
  }

  function generar (cursos: Array<Course>, i: number, eventos: Array<any>, numCursos: number = 0, numCruces: number): void {
    if (i < cursos.length) {
      // se almacena las sections disponibles
      const sections = []
      for (let j = 0; j < cursos[i].sections.length; j++) {
        // buscar sections sin cruce
        let numCrucesSeccion = 0
        // para la seccion tomada
        let hayCruces = false
        for (let k = 0; k < cursos[i].sections[j].classSessions.length; k++) {
          // buscar cruce en la carga horaria de la seccion
          if (eventos.length > 0) {
            let hayCruce
            const evento = {
              start: convertToDate(cursos[i].sections[j].classSessions[k].day, cursos[i].sections[j].classSessions[k].startTime),
              end: convertToDate(cursos[i].sections[j].classSessions[k].day, cursos[i].sections[j].classSessions[k].endTime)
            }
            hayCruce = false
            for (let l = 0; (l < eventos.length) && (!hayCruce); l++) {
              if (!notIntersects(eventos[l], evento)) {
                hayCruce = true// si hay cruce
                // Admitir cruce
                ocurrences.add(JSON.stringify({
                  type: 'Cruce de ' + cursos[i].sections[j].classSessions[k].typeSchedule + ' - ' + eventos[l].typeSchedule,
                  elements: [{
                    code: cursos[i].code + cursos[i].sections[j].section.id,
                    section: cursos[i].sections[j].section.id,
                    day: cursos[i].sections[j].classSessions[k].day,
                    startTime: cursos[i].sections[j].classSessions[k].startTime,
                    endTime: cursos[i].sections[j].classSessions[k].endTime
                  },
                  {
                    code: eventos[l].code,
                    section: eventos[l].sectionCode,
                    day: eventos[l].day,
                    startTime: eventos[l].startTime,
                    endTime: eventos[l].endTime
                  }]
                }))
                if (((numCrucesSeccion + numCruces) <= crucesCursos) && (cursos[i].code !== eventos[l].code)) {
                  if (
                    ((cursos[i].sections[j].classSessions[k].typeSchedule.includes('P', 0) &&
                      eventos[l].typeSchedule.includes('P', 0)) && !crossesPractices) ||
                    (!(cruzarEventos) && eventos[l].typeSchedule === 'miEvento')) {
                    hayCruce = true
                    if ((cursos[i].sections[j].classSessions[k].typeSchedule.includes('P', 0) &&
                      eventos[l].typeSchedule.includes('P', 0))) {

                    }
                  } else {
                    hayCruce = false
                    numCrucesSeccion++
                  }
                }
              }
            }
            if (hayCruce) {
              hayCruces = true
            }
          }
        }

        if (!(hayCruces) && ((numCrucesSeccion + numCruces) <= crucesCursos)) {
          // se guarda las sections sin cruce
          sections.push({
            ...cursos[i].sections[j],
            numCruces: numCrucesSeccion
          })
        }
      }
      if (sections.length > 0) {
        for (let num = 0; num < sections.length; num++) {
          generar(cursos, i + 1,
            eventos.concat(agregarAMisEventos(cursos[i], sections[num], colors[i])),
            numCursos + 1,
            (numCruces + sections[num].numCruces))
        }
      } else {
        return
      }
    }

    if (i === cursos.length) {
      const events = [...eventos]
      const id = events.sort((a, b) => (a.id - b.id)).map(e => e.id).join(',')
      const scheduleId = events.sort((a, b) => (a.scheduleId - b.scheduleId)).map(e => e.scheduleId).join(',')
      classSessions.push({
        id,
        scheduleId,
        eventos,
        numCruces,
        numCursos,
        isFavorite: false,
        startDate: weekDays[1].startDate
      })
    }
  }

  generar(cursos, i, eventos, numCursos, numCruces)
  return {
    schedules: classSessions,
    ocurrences: Array.from(ocurrences).map((o: any) => {
      const object: any = JSON.parse(o)
      return ({
        type: object.type,
        elementA: object.elements[0],
        elementB: object.elements[1]
      })
    })
  }
}

export function getSchedules (
  subjects: Array<any>,
  myEvents: Array<any>,
  options = {
    credits: 100,
    crossingSubjects: 0,
    crossEvent: false,
    crossPractices: false
  }
): { occurrences: any[]; schedules: any[]; combinations: any[] } {
  const quantitySubjects = subjects.length
  const maxQuantity = subjects.length
  const totalCrossing = 0
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
        console.log(otherEvents)
        let intersections = 0
        for (let k = 0; k < otherEvents.length; k++) {
          if (isIntersects(event, otherEvents[k])) {
            if ((otherEvents[k].type?.includes('P', 0) && event.type?.includes('P', 0))) {
              if (crossingCombination + intersections <= options.crossingSubjects) {
                intersections++
              } else {
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
    if ((totalCrossing + crossingCombination) <= options.crossingSubjects) {
      crossings[i] = crossingCombination
      schedules.push({
        schedule: combination,
        crossings: crossingCombination,
        events: combination.map((c, index) => scheduleToEvent(c, colors[index])).flat().concat(myEvents)
      })
      increment(indexSchedules.length - 1)
    }
  }

  return {
    schedules: [],
    combinations: schedules,
    occurrences: []
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

function agregarAMisEventos (curso: Course, seccion: Section, color: string): Array<any> {
  const events: Array<any> = []
  for (let i = 0; i < seccion.classSessions.length; i++) {
    const event = seccion.classSessions[i]
    event.code = curso.code + seccion.section.id
    event.scheduleId = seccion.scheduleSubjectId || seccion.id
    event.title = curso.code + ' ' + seccion.section.id + ' ' + curso.name + ''
    event.start = obtenerDiaSemana(seccion.classSessions[i].day).concat(seccion.classSessions[i].startTime)
    event.end = obtenerDiaSemana(seccion.classSessions[i].day).concat(seccion.classSessions[i].endTime)
    event.name = curso.name
    event.color = color
    event.courseCode = curso.code
    event.sectionCode = seccion.section.id
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
