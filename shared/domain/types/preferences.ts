import type { Weekdays } from './event'
import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'
import type { BrandUUID } from './ids'

export interface IBasePreferences extends ReplicationState {
  weekDays: Weekdays[]
  crossings: number
  maxGenerationHistory: number
}

export type PreferenceID = BrandUUID<'PreferenceID'>
export interface IPreferences
  extends IBasePreferences, IAuditable, ReplicatedIdentity<PreferenceID> {}

export type IPreferencesCreate = IBasePreferences
export type IPreferencesUpdate = Partial<IPreferencesCreate>
