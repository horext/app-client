import type { IHourlyLoadResponse } from '../interfaces/hourly-load'
import { BaseApi } from './base'

export interface IHourlyLoadApi {
  getAllByFaculty(facultyId: number): Promise<IHourlyLoadResponse[]>
  getLatestByFaculty(facultyId: number): Promise<IHourlyLoadResponse>
}

const PATH_SUBJECTS = 'hourlyLoads'

export class HourlyLoadApi extends BaseApi {
  getAllByFaculty(facultyId: number) {
    return this.$fetch<IHourlyLoadResponse[]>(PATH_SUBJECTS, {
      method: 'GET',
      params: { faculty: facultyId },
    })
  }

  getLatestByFaculty(facultyId: number) {
    return this.$fetch<IHourlyLoadResponse>(PATH_SUBJECTS + '/latest', {
      method: 'GET',
      params: {
        faculty: facultyId,
      },
    })
  }
}
