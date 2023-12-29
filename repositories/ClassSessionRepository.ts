import type { $Fetch } from 'nitropack'
const PATH_SUBJECTS = 'classSessions'
export default ($axios: $Fetch) => ({
  findScheduleId(schedule: number) {
    return $axios(PATH_SUBJECTS, {
      method: 'GET',
      params: {
        schedule,
      },
    })
  },
  findScheduleIds(schedulesIds: Array<number>) {
    return $axios(PATH_SUBJECTS, {
      method: 'GET',
      params: {
        schedules: schedulesIds.join(','),
      },
    })
  },
})
