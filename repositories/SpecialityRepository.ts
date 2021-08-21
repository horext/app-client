import { NuxtAxiosInstance } from '@nuxtjs/axios'
const PATH_SUBJECTS = 'specialities'
export default ($axios: NuxtAxiosInstance) => ({
  getAllByFaculty (facultyId: any) {
    return $axios.get(PATH_SUBJECTS, {
      params: {
        faculty: facultyId
      }
    })
  }
})
