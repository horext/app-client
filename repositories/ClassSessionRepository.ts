import { NuxtAxiosInstance } from '@nuxtjs/axios'
const PATH_SUBJECTS = 'classSessions'
export default ($axios: NuxtAxiosInstance) => ({
  findScheduleId (schedule:number) {
    return $axios.get(PATH_SUBJECTS,
      {
        params: {
          schedule
        }
      })
  },
  findScheduleIds (schedulesIds:Array<number>) {
    return $axios.get(PATH_SUBJECTS,
      {
        params: {
          schedules: schedulesIds.join(',')
        }
      })
  }
})
