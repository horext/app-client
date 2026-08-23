import { PlannedSubject } from '#shared/domain'
import type { BasePlannedSubject } from '#shared/domain'
import type { IPlannedSubject } from '#shared/domain/types/subject'
import { toAuditRecord } from './audit'

export const fromRecord = (record: IPlannedSubject) =>
  PlannedSubject.reconstitute(record)
export const toCreateRecord = (entity: BasePlannedSubject) => ({
  subject: structuredClone(entity.subject),
  schedules: structuredClone(entity.schedules),
  color: entity.color,
  externalId: entity.externalId,
  revision: entity.revision,
})
export const toRecord = (entity: PlannedSubject): IPlannedSubject =>
  Object.assign(
    toCreateRecord(entity),
    { id: entity.id },
    toAuditRecord(entity.audit),
  )
