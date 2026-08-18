import type { IHourlyLoad } from './houly-load'

export type HourlyLoadSelection =
  | {
      source: 'official'
      facultyId: number
      specialityId: number
      hourlyLoad: IHourlyLoad
    }
  | {
      source: 'local'
      facultyId: number
      specialityId: number
    }
