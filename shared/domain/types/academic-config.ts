import type { IHourlyLoad } from './hourly-load'
import type { IAuditable } from './entity-metadata'
import type { UUID } from 'crypto'

export interface IBaseAcademicConfig {
  externalId?: UUID
  revision?: number
  hourlyLoad: IHourlyLoad | null
}

export interface IAcademicConfig extends IBaseAcademicConfig, IAuditable {
  id: UUID
}

export type IAcademicConfigCreate = IBaseAcademicConfig
export type IAcademicConfigUpdate = Partial<IAcademicConfigCreate>
