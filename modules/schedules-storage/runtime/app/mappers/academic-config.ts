import { AcademicConfig } from '#shared/domain'
import type { BaseAcademicConfig } from '#shared/domain'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import { toAuditRecord } from './audit'

export const fromRecord = (record: IAcademicConfig) =>
  AcademicConfig.reconstitute(record)
export const toCreateRecord = (entity: BaseAcademicConfig) => ({
  hourlyLoad: structuredClone(entity.hourlyLoad),
  externalId: entity.externalId,
  revision: entity.revision,
})
export const toRecord = (entity: AcademicConfig): IAcademicConfig =>
  Object.assign(
    toCreateRecord(entity),
    { id: entity.id },
    toAuditRecord(entity.audit),
  )
