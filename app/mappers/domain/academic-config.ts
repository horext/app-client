import type { AcademicConfig } from '~~/shared/domain'
import type { IUserAcademicConfig } from '~/interfaces/academic-config'

export function toAcademicConfigDto(
  entity: AcademicConfig,
): IUserAcademicConfig {
  return { id: entity.id, hourlyLoad: structuredClone(entity.hourlyLoad) }
}
