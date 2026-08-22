import type { Profile } from '~~/shared/domain'
import type { IUserProfile } from '~/interfaces/profile'

export function toProfileDto(entity: Profile): IUserProfile {
  return {
    id: entity.id,
    facultyId: entity.facultyId,
    specialityId: entity.specialityId,
    studyPlanId: entity.studyPlanId,
    setupCompleted: entity.setupCompleted,
  }
}
