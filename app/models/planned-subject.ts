import type {
  ISubject,
  ISubjectSchedule,
  PlannedSubjectWithCurrentSchedules,
} from '~/interfaces/subject'
import type { PlannedSubjectId } from '~~/shared/domain'

const convertSubject = (subject: ISubject): ISubject => ({
  id: subject.id,
  course: {
    id: subject.course.id,
    name: subject.course.name,
  },
  type: {
    id: subject.type.id,
    name: subject.type.name,
    code: subject.type.code,
  },
  studyPlan: {
    id: subject.studyPlan.id,
    fromDate: subject.studyPlan.fromDate,
    code: subject.studyPlan.code,
    organizationUnit: {
      id: subject.studyPlan.organizationUnit.id,
    },
  },
  credits: subject.credits,
  cycle: subject.cycle,
})

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
      name: session.classroom?.name,
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
export class PlannedSubject<
  ID extends PlannedSubjectId | undefined = PlannedSubjectId,
> {
  id: ID
  subject: ISubject
  schedules: ISubjectSchedule[]
  color: string

  constructor(
    id: ID,
    subject: ISubject,
    schedules: ISubjectSchedule[],
    color: string,
  ) {
    this.id = id
    this.subject = subject
    this.schedules = [...schedules]
    this.color = color
  }

  toCreateRequest() {
    return {
      subject: convertSubject(this.subject),
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
    data: PlannedSubjectWithCurrentSchedules,
  ): PlannedSubject<PlannedSubjectId> | PlannedSubject<undefined> {
    if ('id' in data) {
      return new PlannedSubject(
        data.id,
        data.subject,
        data.currentSchedules,
        data.color,
      )
    }
    return new PlannedSubject(
      undefined,
      data.subject,
      data.currentSchedules,
      data.color,
    )
  }
}
