import { NuxtAxiosInstance } from '@nuxtjs/axios'
const PATH_SUBJECTS = 'hourlyLoads'
export default ($axios: NuxtAxiosInstance) => ({
  getLatestByFaculty (facultyId: any) {
    return $axios.get(PATH_SUBJECTS + '/latest', {
      params: {
        faculty: facultyId
      }
    })
  }
})
