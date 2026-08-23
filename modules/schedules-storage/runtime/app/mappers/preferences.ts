import { Preferences } from '#shared/domain'
import type { BasePreferences } from '#shared/domain'
import type { IPreferences } from '#shared/domain/types/preferences'
import { toAuditRecord } from './audit'

export const fromRecord = (record: IPreferences) =>
  Preferences.reconstitute(record)
export const toCreateRecord = (entity: BasePreferences) => ({
  weekDays: structuredClone(entity.weekDays),
  crossings: entity.crossings,
  maxGenerationHistory: entity.maxGenerationHistory,
  externalId: entity.externalId,
  revision: entity.revision,
})
export const toRecord = (entity: Preferences): IPreferences =>
  Object.assign(
    toCreateRecord(entity),
    { id: entity.id },
    toAuditRecord(entity.audit),
  )
