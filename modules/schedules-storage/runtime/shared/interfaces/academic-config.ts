import type { IHourlyLoad } from './houly-load'

export interface IUserAcademicConfig {
  id: 'academic-config'
  hourlyLoad: IHourlyLoad | null
}
