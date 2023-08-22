import { AxiosInstance } from 'axios'
import { IOrganization } from '~/interfaces/organization'
const PATH_SUBJECTS = 'specialities'
export default ($axios: AxiosInstance) => ({
  getAllByFaculty(facultyId: any) {
    return $axios.get<IOrganization[]>(PATH_SUBJECTS, {
      params: {
        faculty: facultyId,
      },
    })
  },
})
