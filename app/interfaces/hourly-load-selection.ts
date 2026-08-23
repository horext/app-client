import type { IHourlyLoad } from './houly-load'

export type HourlyLoadSelection =
  | {
      source: 'official'
      facultyId: number
      specialityId?: number
      studyPlanId?: number
      hourlyLoad: IHourlyLoad
    }
  | {
      source: 'local'
    }
