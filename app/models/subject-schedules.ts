import type { UUID } from 'crypto'
import type {
  IBaseSubjectSchedules,
  ISubject,
  ISubjectSchedule,
  ISubjectSchedules,
} from '~/interfaces/subject'

export class SubjectSchedules<ID extends UUID | undefined = UUID> {
  id: ID
  subject: ISubject
  schedules: ISubjectSchedule[]

  constructor(id: ID, subject: ISubject, schedules: ISubjectSchedule[]) {
    this.id = id
    this.subject = subject
    this.schedules = [...schedules]
  }

  toCreateRequest() {
    return {
      subject: this.subject,
      schedules: this.schedules.map((s) => ({
        ...s,
      })),
    }
  }

  toUpdateRequest() {
    return {
      id: this.id,
      schedules: this.schedules.map((s) => ({
        ...s,
      })),
    }
  }

  static buildFrom(
    data: IBaseSubjectSchedules | ISubjectSchedules,
  ): SubjectSchedules<UUID> | SubjectSchedules<undefined> {
    if ('id' in data) {
      return new SubjectSchedules(data.id, data.subject, data.schedules)
    }
    return new SubjectSchedules(undefined, data.subject, data.schedules)
  }
}
