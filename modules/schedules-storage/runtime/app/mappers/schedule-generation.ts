import { ScheduleGeneration } from '#shared/domain'
import type { BaseScheduleGeneration } from '#shared/domain'
import type { IScheduleGeneration } from '#shared/domain/types/schedule-generation'
import { toAuditRecord } from './audit'

export const fromRecord = (record: IScheduleGeneration) =>
  ScheduleGeneration.reconstitute(record)
export const toCreateRecord = (entity: BaseScheduleGeneration) => ({
  generatedAt: entity.generatedAt,
  scheduleIds: structuredClone(entity.scheduleIds),
  resultCount: entity.resultCount,
  occurrences: structuredClone(entity.occurrences),
  crossingsSetting: entity.crossingsSetting,
  weekDays: structuredClone(entity.weekDays),
  hourlyLoadId: entity.hourlyLoadId,
  externalId: entity.externalId,
  revision: entity.revision,
})
export const toRecord = (entity: ScheduleGeneration): IScheduleGeneration =>
  Object.assign(
    toCreateRecord(entity),
    { id: entity.id },
    toAuditRecord(entity.audit),
  )
