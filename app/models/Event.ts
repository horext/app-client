import type { UUID } from 'crypto'
import type {
  EventCategories,
  IActivity,
  IEvent,
  Weekdays,
} from '~/interfaces/event'
import type { IScheduleSubjectGenerate } from '~/interfaces/schedule'
import { convertToDate } from '~/utils/weekday'

export default class Event<ID extends string | undefined = string> {
  id: ID
  day: Weekdays
  startTime: string
  endTime: string

  title: string = ''
  description?: string
  location?: string
  color: string

  category?: EventCategories
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
    category: EventCategories | undefined = undefined,
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

  get start() {
    return convertToDate(this.day, this.startTime)
  }

  get end() {
    return convertToDate(this.day, this.endTime)
  }

  get isPractice() {
    return this.type.includes('P')
  }

  get isActivity() {
    return this.type.includes('MY_EVENT')
  }

  intersects(other: Event<string | undefined>): boolean {
    return !(this.end <= other.start || other.end <= this.start)
  }

  static buildFrom(event: IEvent) {
    return new Event(
      event.day,
      event.startTime,
      event.endTime,
      event.title,
      event.description,
      event.location,
      event.color,
      event.type,
      event.category,
      event.id,
    )
  }
}

export class Activity<ID extends UUID | undefined = UUID | undefined> extends Event<ID> {
  constructor(
    day: Weekdays = 1,
    startTime = '08:00',
    endTime = '10:00',
    title = '',
    description = '',
    location = '',
    color = '#1976d2',
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
      'MY_EVENT',
      'MY_EVENT',
      id,
    )
  }

  static buildActivityFrom(event: IActivity) {
    return new Activity(
      event.day,
      event.startTime,
      event.endTime,
      event.title,
      event.description,
      event.location,
      event.color,
      event.id,
    )
  }
}

export class CourseEvent extends Event implements IEvent {
  override id: string

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
      'COURSE',
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
