import { NuxtAxiosInstance } from '@nuxtjs/axios'
const PATH_SCHEDULE_SUBJECTS = 'scheduleSubjects'
export default ($axios: NuxtAxiosInstance) => ({
  findBySubjectIdAndHourlyLoadId (subject:number, hourlyLoad:number) {
    return $axios.get(PATH_SCHEDULE_SUBJECTS,
      {
        params: {
          subject,
          hourlyLoad
        }
      })
  },
  getAllByIds (ids:Array<number>) {
    return $axios.get(PATH_SCHEDULE_SUBJECTS,
      {
        params: {
          ids: ids.join(',')
        }
      })
  },
  findBySearch (search: string, speciality:string, hourlyLoad:string) {
    return $axios.get(PATH_SCHEDULE_SUBJECTS + '?search=' + search,
      {
        params: {
          speciality,
          hourlyLoad
        }
      })
  }

})