import type { IHourlyLoad } from './houly-load'
import type { UUID } from 'crypto'

export interface IUserAcademicConfig {
  id: UUID
  hourlyLoad: IHourlyLoad | null
}
