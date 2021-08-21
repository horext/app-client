import { NuxtAxiosInstance } from '@nuxtjs/axios'
const PATH_SUBJECTS = 'faculties'
export default ($axios: NuxtAxiosInstance) => ({
  getAll () {
    return $axios.get(PATH_SUBJECTS)
  }
})
