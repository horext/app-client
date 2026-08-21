import type {
  IBaseScheduleGenerate as DomainBaseScheduleGenerate,
  ScheduleGenerateId,
} from '~~/shared/domain/types/schedule'
import type { IEvent } from '~/interfaces/event'
import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '~/interfaces/schedule'
import {
  toDomainSubject,
  toDomainSubjectSchedule,
} from '~/mappers/subject/domain'

function toDomainEvent(event: IEvent): IEvent {
  return { ...event }
}

interface DomainPersistedSchedule extends DomainBaseScheduleGenerate {
  id: ScheduleGenerateId
}

function toDomainScheduleValues(
  schedule: IBaseScheduleGenerate,
): DomainBaseScheduleGenerate {
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
  schedule: IScheduleGenerate,
): DomainPersistedSchedule
export function toDomainSchedule(
  schedule: IBaseScheduleGenerate,
): DomainBaseScheduleGenerate
export function toDomainSchedule(
  schedule: IBaseScheduleGenerate | IScheduleGenerate,
): DomainBaseScheduleGenerate | DomainPersistedSchedule {
  const mapped = toDomainScheduleValues(schedule)
  return 'id' in schedule ? Object.assign(mapped, { id: schedule.id }) : mapped
}
