import type { $Fetch } from 'nitropack'
import type { IHourlyLoad } from '~/interfaces/houly-load'

const PATH_SUBJECTS = 'hourlyLoads'
export default ($axios: $Fetch) => ({
  getLatestByFaculty(facultyId: any) {
    return $axios<IHourlyLoad>(PATH_SUBJECTS + '/latest', {
      method: 'GET',
      params: {
        faculty: facultyId,
      },
    })
  },
})
