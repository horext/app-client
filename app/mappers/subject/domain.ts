import type {
  IBaseSubjectSchedules as DomainBaseSubjectSchedules,
  ISubject as DomainSubject,
  ISubjectSchedule as DomainSubjectSchedule,
  IUserSubjectUpdate as DomainSubjectUpdate,
} from '~~/shared/domain/types/subject'
import type {
  IBaseSubjectSchedules,
  ISubject,
  ISubjectSchedule,
  ISubjectSchedules,
} from '~/interfaces/subject'

export function toDomainSubject(subject: ISubject): DomainSubject {
  return {
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
      name: subject.studyPlan.name,
      fromDate: subject.studyPlan.fromDate,
      code: subject.studyPlan.code,
      createdAt: subject.studyPlan.createdAt,
      updatedAt: subject.studyPlan.updatedAt,
      organizationUnit: {
        id: subject.studyPlan.organizationUnit.id,
      },
    },
    credits: subject.credits,
    cycle: subject.cycle,
    createdAt: subject.createdAt,
    updatedAt: subject.updatedAt,
  }
}

function toDomainSubjectPatch(
  subject: ISubject,
): NonNullable<DomainSubjectUpdate['subject']> {
  const { id: _id, ...patch } = toDomainSubject(subject)
  return patch
}

export function toDomainSubjectSchedule(
  schedule: ISubjectSchedule,
): DomainSubjectSchedule {
  return {
    id: schedule.id,
    section: {
      id: schedule.section.id,
    },
    scheduleSubject: {
      id: schedule.scheduleSubject.id,
    },
    sessions: schedule.sessions.map((session) => ({
      id: session.id,
      schedule: {
        id: session.schedule.id,
      },
      classroom: {
        id: session.classroom.id,
        code: session.classroom.code,
        name: session.classroom.name,
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
        name: session.type.name,
      },
      day: session.day,
      startTime: session.startTime,
      endTime: session.endTime,
    })),
  }
}

export function toDomainSubjectSchedules(
  subject: IBaseSubjectSchedules,
): DomainBaseSubjectSchedules {
  return {
    subject: toDomainSubject(subject.subject),
    schedules: subject.schedules.map(toDomainSubjectSchedule),
    color: subject.color,
  }
}

export function toDomainSubjectUpdate(
  subject: Pick<ISubjectSchedules, 'id'> &
    Partial<Pick<ISubjectSchedules, 'subject' | 'schedules' | 'color'>>,
): DomainSubjectUpdate {
  return {
    ...(subject.subject
      ? { subject: toDomainSubjectPatch(subject.subject) }
      : {}),
    ...(subject.schedules
      ? { schedules: subject.schedules.map(toDomainSubjectSchedule) }
      : {}),
    ...(typeof subject.color !== 'undefined' ? { color: subject.color } : {}),
  }
}
