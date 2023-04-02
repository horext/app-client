import { AxiosInstance } from 'axios'
const PATH_SUBJECTS = 'subjects'
export default ($axios: AxiosInstance) => ({
  findBySearch (search: string, speciality:number, hourlyLoad:string) {
    return $axios.get(PATH_SUBJECTS + '?search=' + search,
      {
        params: {
          speciality,
          hourlyLoad
        }
      })
  }
})
