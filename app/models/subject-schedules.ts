import type { UUID } from 'crypto'
import type {
  IBaseSubjectSchedules,
  ISubject,
  ISubjectSchedule,
  ISubjectSchedules,
} from '~/interfaces/subject'

const convertSchedule = (s: ISubjectSchedule): ISubjectSchedule => ({
  id: s.id,
  scheduleSubject: {
    id: s.scheduleSubject.id,
  },
  section: {
    id: s.section.id,
  },
  sessions: s.sessions.map((session) => ({
    schedule: {
      id: session.schedule.id,
    },
    classroom: {
      id: session.classroom.id,
      code: session.classroom.code,
    },
    teacher: session.teacher
      ? {
          id: session.teacher.id,
          fullName: session.teacher.fullName,
        }
      : undefined,
    type: {
      id: session.type.id,
      code: session.type.code,
    },
    day: session.day,
    startTime: session.startTime,
    endTime: session.endTime,
    id: session.id,
  })),
})
export class SubjectSchedules<ID extends UUID | undefined = UUID> {
  id: ID
  subject: ISubject
  schedules: ISubjectSchedule[]
  color: string

  constructor(
    id: ID,
    subject: ISubject,
    schedules: ISubjectSchedule[],
    color = '#1976d2',
  ) {
    this.id = id
    this.subject = subject
    this.schedules = [...schedules]
    this.color = color
  }

  toCreateRequest() {
    return {
      subject: this.subject,
      schedules: this.schedules.map(convertSchedule),
      color: this.color,
    }
  }
  toUpdateRequest() {
    return {
      id: this.id,
      schedules: this.schedules.map(convertSchedule),
      color: this.color,
    }
  }

  static buildFrom(
    data:
      | (IBaseSubjectSchedules & { currentSchedules: ISubjectSchedule[] })
      | (ISubjectSchedules & { currentSchedules: ISubjectSchedule[] }),
  ): SubjectSchedules<UUID> | SubjectSchedules<undefined> {
    if ('id' in data) {
      return new SubjectSchedules(
        data.id,
        data.subject,
        data.currentSchedules,
        data.color,
      )
    }
    return new SubjectSchedules(
      undefined,
      data.subject,
      data.currentSchedules,
      data.color,
    )
  }
}
