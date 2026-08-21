import type {
  IBaseScheduleGenerate as DomainBaseScheduleGenerate,
  IScheduleGenerate as DomainScheduleGenerate,
} from '~~/shared/domain/types/schedule'
import type { IEvent } from '~/interfaces/event'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import {
  toDomainSubject,
  toDomainSubjectSchedule,
} from '~/mappers/subject/domain'

function toDomainEvent(event: IEvent): IEvent {
  return { ...event }
}

export function toDomainSchedule(
  schedule: Pick<
    IScheduleGenerate,
    'scheduleSubjectKey' | 'schedulesSubject' | 'crossings' | 'events'
  > &
    Partial<Pick<IScheduleGenerate, 'id'>>,
): DomainBaseScheduleGenerate & Partial<Pick<DomainScheduleGenerate, 'id'>> {
  return {
    ...('id' in schedule ? { id: schedule.id } : {}),
    scheduleSubjectKey: schedule.scheduleSubjectKey,
    schedulesSubject: schedule.schedulesSubject.map((item) => ({
      ...toDomainSubjectSchedule(item),
      subject: toDomainSubject(item.subject),
    })),
    crossings: schedule.crossings,
    events: schedule.events.map(toDomainEvent),
  }
}
