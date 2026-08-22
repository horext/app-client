import type {
  IBaseGeneratedSchedule as DomainBaseGeneratedSchedule,
  GeneratedScheduleId,
} from '~~/shared/domain/types/schedule'
import type { IEvent } from '~/interfaces/event'
import type {
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
  GeneratedScheduleInput,
} from '~/interfaces/schedule'
import {
  toDomainSubject,
  toDomainSubjectSchedule,
} from '~/mappers/subject/domain'

function toDomainEvent(event: IEvent): IEvent {
  return { ...event }
}

interface DomainPersistedSchedule extends DomainBaseGeneratedSchedule {
  id: GeneratedScheduleId
}

function toDomainScheduleValues(
  schedule: IBaseGeneratedSchedule,
): DomainBaseGeneratedSchedule {
  return {
    scheduleSubjectKey: schedule.scheduleSubjectKey,
    schedulesSubject: schedule.schedulesSubject.map((item) =>
      Object.assign(toDomainSubjectSchedule(item), {
        subject: toDomainSubject(item.subject),
      }),
    ),
    crossings: schedule.crossings,
    events: schedule.events.map(toDomainEvent),
  }
}

export function toDomainSchedule(
  schedule: IGeneratedSchedule,
): DomainPersistedSchedule
export function toDomainSchedule(
  schedule: IBaseGeneratedSchedule,
): DomainBaseGeneratedSchedule
export function toDomainSchedule(
  schedule: GeneratedScheduleInput,
): DomainBaseGeneratedSchedule | DomainPersistedSchedule {
  const mapped = toDomainScheduleValues(schedule)
  return 'id' in schedule ? Object.assign(mapped, { id: schedule.id }) : mapped
}
