
import { AxiosInstance } from 'axios'
const PATH_SUBJECTS = 'specialities'
export default ($axios: AxiosInstance) => ({
  getAllByFaculty (facultyId: any) {
    return $axios.get(PATH_SUBJECTS, {
      params: {
        faculty: facultyId
      }
    })
  }
})
