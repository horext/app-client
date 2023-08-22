import { AxiosInstance } from 'axios'
import { IHourlyLoad } from '~/interfaces/houly-load'

const PATH_SUBJECTS = 'hourlyLoads'
export default ($axios: AxiosInstance) => ({
  getLatestByFaculty(facultyId: any) {
    return $axios.get<IHourlyLoad>(PATH_SUBJECTS + '/latest', {
      params: {
        faculty: facultyId,
      },
    })
  },
})
