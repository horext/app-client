import { AxiosInstance } from 'axios'
import { IPage } from '~/interfaces/page'
import { ISubject } from '~/interfaces/subject'

const PATH_SUBJECTS = 'subjects'
export default ($axios: AxiosInstance) => ({
  findBySearch (search: string, speciality:number, hourlyLoad:number) {
    return $axios.get<IPage<ISubject>>(PATH_SUBJECTS + '?search=' + search,
      {
        params: {
          speciality,
          hourlyLoad
        }
      })
  }
})
