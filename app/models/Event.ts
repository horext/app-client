import type { UUID } from 'crypto'
import type { IActivity, IEvent, Weekdays } from '~/interfaces/event'
import type { IScheduleSubjectGenerate } from '~/interfaces/schedule'

export enum EventCategory {
  COURSE = 'COURSE',
  MY_EVENT = 'MY_EVENT',
}

export default abstract class Event<ID extends string | undefined = string> {
  id: ID
  day: Weekdays
  startTime: string
  endTime: string

  title: string = ''
  description?: string
  location?: string
  color: string

  category?: EventCategory
  type: string

  constructor(
    day: Weekdays,
    startTime: string,
    endTime: string,
    title: string,
    description: string = '',
    location: string = '',
    color: string,
    type: string,
    category: EventCategory | undefined = undefined,
    id: ID,
  ) {
    this.day = day
    this.startTime = startTime
    this.endTime = endTime
    this.title = title
    this.description = description
    this.location = location
    this.color = color
    this.category = category
    this.type = type
    this.id = id
  }

  abstract get hasActivityCrossingRestriction(): boolean

  abstract get hasSubjectSessionCrossingRestriction(): boolean

  intersects(other: Event<string | undefined>): boolean {
    const t = (s: string) => {
      const i = s.indexOf('T')
      return i >= 0 ? s.slice(i + 1, i + 6) : s.slice(0, 5)
    }
    const thisStart = t(this.startTime)
    const thisEnd = t(this.endTime)
    const otherStart = t(other.startTime)
    const otherEnd = t(other.endTime)
    return !(thisEnd <= otherStart || otherEnd <= thisStart)
  }
}

export class Activity<
  ID extends UUID | undefined = UUID | undefined,
> extends Event<ID> {
  allowOverlap: boolean

  constructor(
    day: Weekdays = 1,
    startTime = '08:00',
    endTime = '10:00',
    title = '',
    description = '',
    location = '',
    color = '#1976d2',
    allowOverlap = true,
    id: ID = undefined as ID,
  ) {
    super(
      day,
      startTime,
      endTime,
      title,
      description,
      location,
      color,
      EventCategory.MY_EVENT,
      EventCategory.MY_EVENT,
      id,
    )
    this.allowOverlap = allowOverlap
  }

  get hasActivityCrossingRestriction() {
    return !this.allowOverlap
  }

  get hasSubjectSessionCrossingRestriction() {
    return false
  }

  static buildActivityFrom(event: Omit<IActivity, 'category' | 'type'>) {
    return new Activity(
      event.day,
      event.startTime,
      event.endTime,
      event.title,
      event.description,
      event.location,
      event.color,
      event.allowOverlap ?? true,
      event.id,
    )
  }
}

export class CourseEvent extends Event implements IEvent {
  override id: string

  get hasActivityCrossingRestriction() {
    return false
  }

  get hasSubjectSessionCrossingRestriction() {
    return this.type.includes('P')
  }

  isCrossingRestricted(
    other: Event<string | undefined>,
    crossActivities: boolean,
    crossPractices: boolean,
  ): boolean {
    const activityRestriction =
      !crossActivities &&
      (this.hasActivityCrossingRestriction ||
        other.hasActivityCrossingRestriction)

    const practiceRestriction =
      !crossPractices &&
      this.hasSubjectSessionCrossingRestriction &&
      other.hasSubjectSessionCrossingRestriction

    return activityRestriction || practiceRestriction
  }

  constructor(
    day: Weekdays,
    startTime: string,
    endTime: string,
    title: string,
    description: string,
    location: string,
    color: string,
    type: string,
    id: string,
  ) {
    super(
      day,
      startTime,
      endTime,
      title,
      description,
      location,
      color,
      type,
      EventCategory.COURSE,
      id,
    )
    this.id = id
  }

  static buildFromSchedule(schedule: IScheduleSubjectGenerate, color: string) {
    if (!schedule.sessions?.length) return []
    const events: Array<CourseEvent> = []
    const sessions = schedule.sessions
    for (let i = 0; i < sessions.length; i++) {
      const course = schedule.subject.course
      const section = schedule.section.id
      const session = sessions[i]!
      const event = new CourseEvent(
        session.day,
        session.startTime,
        session.endTime,
        course.id + ' ' + section + ' - ' + course.name,
        ` Docente: ${session.teacher?.fullName}\n Curso: ${course.id} - ${course.name}\n Sección: ${section}`,
        session.classroom?.code,
        color,
        session.type.code,
        String(session.id),
      )
      events.push(event)
    }
    return events
  }
}
