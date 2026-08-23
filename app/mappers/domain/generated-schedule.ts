import type { GeneratedSchedule } from '~~/shared/domain'
import type { IGeneratedSchedule } from '~/interfaces/schedule'

export function toGeneratedScheduleDto(
  entity: GeneratedSchedule,
): IGeneratedSchedule {
  return {
    id: entity.id,
    scheduleSubjectKey: entity.scheduleSubjectKey,
    schedulesSubject: structuredClone(entity.schedulesSubject),
    crossings: entity.crossings,
    events: structuredClone(entity.events),
  }
}
