import { ScheduleFavorite } from '#shared/domain'
import type { BaseScheduleFavorite } from '#shared/domain'
import type { IScheduleFavorite } from '#shared/domain/types/schedule'
import { toAuditRecord } from './audit'

export const fromRecord = (record: IScheduleFavorite) =>
  ScheduleFavorite.reconstitute(record)
export const toCreateRecord = (entity: BaseScheduleFavorite) => ({
  id: entity.id,
  externalId: entity.externalId,
  revision: entity.revision,
})
export const toRecord = (entity: ScheduleFavorite): IScheduleFavorite =>
  Object.assign(toCreateRecord(entity), toAuditRecord(entity))
