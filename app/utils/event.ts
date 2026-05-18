import type { IInterval } from '~/interfaces/interval'
import type { IScheduleSubjectGenerate } from '~/interfaces/schedule'
import Event from '~/models/Event'

export const isIntersects = (
  eventTarget: IInterval,
  eventSource: IInterval,
): boolean =>
  !(
    eventTarget.end <= eventSource.start || eventSource.end <= eventTarget.start
  )

export function scheduleToEvent(
  schedule: IScheduleSubjectGenerate,
  color: string,
): Array<Event> {
  const events: Array<Event> = []
  const sessions = schedule?.sessions || []
  for (let i = 0; i < sessions.length; i++) {
    const course = schedule.subject.course
    const section = schedule.section.id
    const session = sessions[i]!
    const event = new Event(
      session.day,
      session.startTime,
      session.endTime,
      course.id + ' ' + section + ' - ' + course.name,
      ` Docente: ${session.teacher?.fullName}\n Curso: ${course.id} - ${course.name}\n Sección: ${section}`,
      session.classroom?.code,
      color,
      session.type.code,
      'COURSE',
      String(session.id),
    )
    events.push(event)
  }
  return events
}
