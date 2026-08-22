import type { Preferences } from '~~/shared/domain'
import type { IUserPreferences } from '~/interfaces/preferences'

export function toPreferencesDto(entity: Preferences): IUserPreferences {
  return {
    id: entity.id,
    weekDays: structuredClone(entity.weekDays),
    crossings: entity.crossings,
    maxGenerationHistory: entity.maxGenerationHistory,
  }
}
