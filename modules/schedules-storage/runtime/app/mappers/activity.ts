import { Activity } from '#shared/domain'
import type { BaseActivity } from '#shared/domain'
import type { IActivity } from '#shared/domain/types/event'
import { toAuditRecord } from './audit'

export const fromRecord = (record: IActivity) => Activity.reconstitute(record)
export const toCreateRecord = (entity: BaseActivity) => ({
  title: entity.title,
  description: entity.description,
  location: entity.location,
  color: entity.color,
  allowOverlap: entity.allowOverlap,
  sessions: structuredClone(entity.sessions),
  externalId: entity.externalId,
  revision: entity.revision,
})
export const toRecord = (entity: Activity): IActivity =>
  Object.assign(
    toCreateRecord(entity),
    { id: entity.id },
    toAuditRecord(entity.audit),
  )
