import type { IHourlyLoad } from './hourly-load'
import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'

export interface IBaseAcademicConfig extends ReplicationState {
  hourlyLoad: IHourlyLoad | null
}

export interface IAcademicConfig
  extends IBaseAcademicConfig, IAuditable, ReplicatedIdentity {}

export type IAcademicConfigCreate = IBaseAcademicConfig
export type IAcademicConfigUpdate = Partial<IAcademicConfigCreate>
