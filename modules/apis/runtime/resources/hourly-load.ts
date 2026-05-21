import type { IHourlyLoadResponse } from '../interfaces/hourly-load'
import { BaseApi } from './base'

export interface IHourlyLoadApi {
  getLatestByFaculty(facultyId: number): Promise<IHourlyLoadResponse>
}

const PATH_SUBJECTS = 'hourlyLoads'

export class HourlyLoadApi extends BaseApi {
  getLatestByFaculty(facultyId: number) {
    return this.$fetch<IHourlyLoadResponse>(PATH_SUBJECTS + '/latest', {
      method: 'GET',
      params: {
        faculty: facultyId,
      },
    })
  }
}
