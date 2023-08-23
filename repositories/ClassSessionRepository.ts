import { AxiosInstance } from 'axios'
const PATH_SUBJECTS = 'classSessions'
export default ($axios: AxiosInstance) => ({
  findScheduleId(schedule: number) {
    return $axios.get(PATH_SUBJECTS, {
      params: {
        schedule,
      },
    })
  },
  findScheduleIds(schedulesIds: Array<number>) {
    return $axios.get(PATH_SUBJECTS, {
      params: {
        schedules: schedulesIds.join(','),
      },
    })
  },
})
