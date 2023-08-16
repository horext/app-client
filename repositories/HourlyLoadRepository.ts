import { AxiosInstance } from 'axios'
const PATH_SUBJECTS = 'hourlyLoads'
export default ($axios: AxiosInstance) => ({
  getLatestByFaculty (facultyId: any) {
    return $axios.get(PATH_SUBJECTS + '/latest', {
      params: {
        faculty: facultyId
      }
    })
  }
})
