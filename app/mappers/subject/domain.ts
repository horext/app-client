import type {
  IBaseSubjectSchedules as DomainBaseSubjectSchedules,
  ISubject as DomainSubject,
  ISubjectSchedule as DomainSubjectSchedule,
  ISubjectUpdate as DomainSubjectPatch,
  IUserSubjectUpdate as DomainSubjectUpdate,
} from '~~/shared/domain/types/subject'
import type {
  IBaseSubjectSchedules,
  ISubject,
  ISubjectSchedule,
  ISubjectSchedulesUpdate,
} from '~/interfaces/subject'

export function toDomainSubject(subject: ISubject): DomainSubject {
  return {
    ...subject,
    course: { ...subject.course },
    type: { ...subject.type },
    studyPlan: {
      ...subject.studyPlan,
      organizationUnit: {
        id: subject.studyPlan.organizationUnit.id,
      },
    },
  }
}

function toDomainSubjectPatch(subject: ISubject): DomainSubjectPatch {
  const { id: _id, ...patch } = toDomainSubject(subject)
  return patch
}

export function toDomainSubjectSchedule(
  schedule: ISubjectSchedule,
): DomainSubjectSchedule {
  return {
    ...schedule,
    section: { ...schedule.section },
    scheduleSubject: { ...schedule.scheduleSubject },
    sessions: schedule.sessions.map((session) => ({
      ...session,
      schedule: { ...session.schedule },
      classroom: {
        ...session.classroom,
      },
      teacher: session.teacher ? { ...session.teacher } : undefined,
      type: { ...session.type },
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
  subject: ISubjectSchedulesUpdate,
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
