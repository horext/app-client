import type { IHourlyLoadResponse } from '../interfaces/hourly-load'
import { BaseApi } from './base'

export interface IHourlyLoadApi {
  getLatestByFaculty(facultyId: number): Promise<IHourlyLoadResponse>
}

export const PATH_HOURLY_LOAD = 'hourlyLoads'

export class HourlyLoadApi extends BaseApi {
  getLatestByFaculty(facultyId: number) {
    return this.$fetch<IHourlyLoadResponse>(PATH_HOURLY_LOAD + '/latest', {
      method: 'GET',
      params: {
        faculty: facultyId,
      },
    })
  }
}
