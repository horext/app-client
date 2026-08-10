import type { Weekdays } from './event'
import type { IEntityMetadata } from './entity-metadata'
import type { UUID } from 'crypto'

export interface IBasePreferences {
  weekDays: Weekdays[]
  crossings: number
  maxGenerationHistory: number
}

export interface IPreferences extends IBasePreferences, IEntityMetadata {
  id: UUID
}
