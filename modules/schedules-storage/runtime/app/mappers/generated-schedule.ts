import { GeneratedSchedule } from '#shared/domain'
import type { BaseGeneratedSchedule } from '#shared/domain'
import type { IGeneratedSchedule } from '#shared/domain/types/schedule'
import { toAuditRecord } from './audit'

export const fromRecord = (record: IGeneratedSchedule) =>
  GeneratedSchedule.reconstitute(record)
export const toCreateRecord = (entity: BaseGeneratedSchedule) => ({
  scheduleSubjectKey: entity.scheduleSubjectKey,
  schedulesSubject: structuredClone(entity.schedulesSubject),
  crossings: entity.crossings,
  events: structuredClone(entity.events),
  externalId: entity.externalId,
  revision: entity.revision,
})
export const toRecord = (entity: GeneratedSchedule): IGeneratedSchedule =>
  Object.assign(
    toCreateRecord(entity),
    { id: entity.id },
    toAuditRecord(entity),
  )
