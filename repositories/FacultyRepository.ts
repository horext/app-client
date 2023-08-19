
import { AxiosInstance } from 'axios'
import { IOrganization } from '~/interfaces/organization'

const PATH_SUBJECTS = 'faculties'
export default ($axios: AxiosInstance) => ({
  getAll () {
    return $axios.get<IOrganization[]>(PATH_SUBJECTS)
  }
})
