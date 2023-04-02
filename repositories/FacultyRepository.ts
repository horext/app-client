
import { AxiosInstance } from 'axios'

const PATH_SUBJECTS = 'faculties'
export default ($axios: AxiosInstance) => ({
  getAll () {
    return $axios.get(PATH_SUBJECTS)
  }
})
