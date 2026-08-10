import type { Weekdays } from './event'
import type { IAuditable } from './entity-metadata'
import type { UUID } from 'crypto'

export interface IBasePreferences {
  externalId?: UUID
  expectedRevision?: number
  weekDays: Weekdays[]
  crossings: number
  maxGenerationHistory: number
}

export interface IPreferences extends IBasePreferences, IAuditable {
  id: UUID
}

export type IPreferencesCreate = IBasePreferences
export type IPreferencesUpdate = Partial<IPreferencesCreate>
