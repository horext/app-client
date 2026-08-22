import { Profile } from '#shared/domain'
import type { BaseProfile } from '#shared/domain'
import type { IProfile } from '#shared/domain/types/profile'
import { toAuditRecord } from './audit'

export const fromRecord = (record: IProfile) => Profile.reconstitute(record)
export const toCreateRecord = (entity: BaseProfile) => ({
  facultyId: entity.facultyId,
  specialityId: entity.specialityId,
  studyPlanId: entity.studyPlanId,
  setupCompleted: entity.setupCompleted,
  externalId: entity.externalId,
  revision: entity.revision,
})
export const toRecord = (entity: Profile): IProfile =>
  Object.assign(
    toCreateRecord(entity),
    { id: entity.id },
    toAuditRecord(entity),
  )
