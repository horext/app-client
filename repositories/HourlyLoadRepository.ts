import type { IHourlyLoad } from '~/interfaces/houly-load'
import { BaseRepository } from './BaseRepository'

const PATH_SUBJECTS = 'hourlyLoads'
export class HourlyLoadRepository extends BaseRepository {
  getLatestByFaculty(facultyId: any) {
    return this.$fetch<IHourlyLoad>(PATH_SUBJECTS + '/latest', {
      method: 'GET',
      params: {
        faculty: facultyId,
      },
    })
  }
}
