import type { Weekdays } from './event'
import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'

export interface IBasePreferences extends ReplicationState {
  weekDays: Weekdays[]
  crossings: number
  maxGenerationHistory: number
}

export interface IPreferences
  extends IBasePreferences, IAuditable, ReplicatedIdentity {}

export type IPreferencesCreate = IBasePreferences
export type IPreferencesUpdate = Partial<IPreferencesCreate>
