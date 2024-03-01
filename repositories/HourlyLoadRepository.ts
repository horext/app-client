import type { $Fetch } from 'nitropack'
import type { IHourlyLoad } from '~/interfaces/houly-load'

const PATH_SUBJECTS = 'hourlyLoads'
export class HourlyLoadRepository {
  constructor(private $fetch: $Fetch) {}

  getLatestByFaculty(facultyId: any) {
    return this.$fetch<IHourlyLoad>(PATH_SUBJECTS + '/latest', {
      method: 'GET',
      params: {
        faculty: facultyId,
      },
    })
  }
}
