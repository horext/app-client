import { NuxtAxiosInstance } from '@nuxtjs/axios'
const PATH_SUBJECTS = 'subjects'
export default ($axios: NuxtAxiosInstance) => ({
  findBySearch (search: string, speciality:string, hourlyLoad:string) {
    return $axios.get(PATH_SUBJECTS + '?search=' + search,
      {
        params: {
          speciality,
          hourlyLoad
        }
      })
  }
})
