import type { IHourlyLoadResponse } from '../interfaces/hourly-load'
import { BaseApi } from './base'

export interface IHourlyLoadApi {
  getAllByFaculty(facultyId: number): Promise<IHourlyLoadResponse[]>
  getLatestByFaculty(facultyId: number): Promise<IHourlyLoadResponse>
}

export const PATH_HOURLY_LOAD = 'hourlyLoads'

export class HourlyLoadApi extends BaseApi {
  getAllByFaculty(facultyId: number) {
    return this.$fetch<IHourlyLoadResponse[]>(PATH_HOURLY_LOAD, {
      method: 'GET',
      params: { faculty: facultyId },
    })
  }

  getLatestByFaculty(facultyId: number) {
    return this.$fetch<IHourlyLoadResponse>(PATH_HOURLY_LOAD + '/latest', {
      method: 'GET',
      params: {
        faculty: facultyId,
      },
    })
  }
}
