import type { IHourlyLoad } from '~/interfaces/houly-load'
import { BaseApi } from './base'

export interface IHourlyLoadApi {
  getLatestByFaculty(facultyId: number): Promise<IHourlyLoad>
}

const PATH_SUBJECTS = 'hourlyLoads'

export class HourlyLoadApi extends BaseApi {
  getLatestByFaculty(facultyId: number) {
    return this.$fetch<IHourlyLoad>(PATH_SUBJECTS + '/latest', {
      method: 'GET',
      params: {
        faculty: facultyId,
      },
    })
  }
}
