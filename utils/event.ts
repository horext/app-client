import type { IInterval } from '~/interfaces/interval'
import type { ISubjectSchedule } from '~/interfaces/subject'
import Event from '~/models/Event'

export const isIntersects = (
  eventTarget: IInterval,
  eventSource: IInterval,
): boolean =>
  !(
    eventTarget.end <= eventSource.start || eventSource.end <= eventTarget.start
  )

export function scheduleToEvent(
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
