import type { IHourlyLoad } from './hourly-load'
import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'
import type { BrandUUID } from './ids'

export interface IBaseAcademicConfig extends ReplicationState {
  hourlyLoad: IHourlyLoad | null
}
export type AcademicConfigId = BrandUUID<'AcademicConfigId'>

export interface IAcademicConfig
  extends
    IBaseAcademicConfig,
    IAuditable,
    ReplicatedIdentity<AcademicConfigId> {}

export type IAcademicConfigCreate = IBaseAcademicConfig
export type IAcademicConfigUpdate = Partial<IAcademicConfigCreate>
