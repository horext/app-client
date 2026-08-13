import type { Weekdays } from './event'
import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'
import type { BrandUUID } from './ids'

export type PreferenceID = BrandUUID<'PreferenceID'>
export interface IBasePreferences extends ReplicationState<PreferenceID> {
  weekDays: Weekdays[]
  crossings: number
  maxGenerationHistory: number
}

export interface IPreferences
  extends IBasePreferences, IAuditable, ReplicatedIdentity<PreferenceID> {}

export type IPreferencesCreate = IBasePreferences
export type IPreferencesUpdate = Partial<IPreferencesCreate>
