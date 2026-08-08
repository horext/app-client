import type { IHourlyLoad } from './houly-load'
import type { IEntityMetadata } from './entity-metadata'

export interface IBaseAcademicConfig {
  hourlyLoad: IHourlyLoad | null
}

export interface IAcademicConfig extends IBaseAcademicConfig, IEntityMetadata {
  id: 'academic-config'
}
