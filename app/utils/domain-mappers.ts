import type { IBaseScheduleGenerate as DomainBaseScheduleGenerate } from '~~/shared/domain/types/schedule'
import type {
  IBaseSubjectSchedules as DomainBaseSubjectSchedules,
  IUserSubjectUpdate as DomainSubjectUpdate,
} from '~~/shared/domain/types/subject'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export function toDomainSchedule(
  schedule: Pick<
    IScheduleGenerate,
    'scheduleSubjectKey' | 'schedulesSubject' | 'crossings' | 'events'
  >,
): DomainBaseScheduleGenerate {
  return {
    scheduleSubjectKey: schedule.scheduleSubjectKey,
    schedulesSubject: schedule.schedulesSubject.map((item) => ({
      ...item,
      sessions: item.sessions.map((session) => ({
        ...session,
        classroom: {
          ...session.classroom,
          name: session.classroom.name ?? undefined,
        },
        type: { id: session.type.id, code: session.type.code },
      })),
    })),
    crossings: schedule.crossings,
    events: schedule.events.map((event) => ({ ...event })),
  }
}

export function toDomainSubjectSchedules(
  subject: import('~/interfaces/subject').IBaseSubjectSchedules,
): DomainBaseSubjectSchedules {
  return {
    ...subject,
    schedules: subject.schedules.map((schedule) => ({
      ...schedule,
      sessions: schedule.sessions.map((session) => ({
        ...session,
        classroom: {
          ...session.classroom,
          name: session.classroom.name ?? undefined,
        },
        type: { id: session.type.id, code: session.type.code },
      })),
    })),
    color: subject.color,
  }
}

export function toDomainSubjectUpdate(
  subject: Pick<import('~/interfaces/subject').ISubjectSchedules, 'id'> &
    Partial<
      Pick<
        import('~/interfaces/subject').ISubjectSchedules,
        'subject' | 'schedules' | 'color'
      >
    >,
): DomainSubjectUpdate {
  return {
    ...(subject.subject ? { subject: subject.subject } : {}),
    ...(subject.schedules
      ? {
          schedules: subject.schedules.map((schedule) => ({
            ...schedule,
            sessions: schedule.sessions.map((session) => ({
              ...session,
              classroom: {
                ...session.classroom,
                name: session.classroom.name ?? undefined,
              },
              type: { id: session.type.id, code: session.type.code },
            })),
          })),
        }
      : {}),
    ...(typeof subject.color !== 'undefined' ? { color: subject.color } : {}),
  }
}
