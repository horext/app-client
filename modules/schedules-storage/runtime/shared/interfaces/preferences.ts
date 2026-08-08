import type { Weekdays } from './event'
import type { IEntityMetadata } from './entity-metadata'

export interface IBasePreferences {
  weekDays: Weekdays[]
  crossings: number
  maxGenerationHistory: number
}

export interface IPreferences extends IBasePreferences, IEntityMetadata {
  id: 'preferences'
}
