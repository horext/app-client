import type { IHourlyLoad } from './houly-load'
import type { IEntityMetadata } from './entity-metadata'
import type { UUID } from 'crypto'

export interface IBaseAcademicConfig {
  hourlyLoad: IHourlyLoad | null
}

export interface IAcademicConfig extends IBaseAcademicConfig, IEntityMetadata {
  id: UUID
}
