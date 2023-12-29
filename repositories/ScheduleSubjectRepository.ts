import type { $Fetch } from 'nitropack'
import type{ IScheduleSubject } from '~/interfaces/schedule-subject'

const PATH_SCHEDULE_SUBJECTS = 'scheduleSubjects'
export default ($axios: $Fetch) => ({
  findBySubjectIdAndHourlyLoadId(subject: number, hourlyLoad: number) {
    return $axios<IScheduleSubject[]>(PATH_SCHEDULE_SUBJECTS, {
      params: {
        subject,
        hourlyLoad,
      },
    })
  },
  getAllByIds(ids: Array<number>) {
    return $axios(PATH_SCHEDULE_SUBJECTS, {
      params: {
        ids: ids.join(','),
      },
    })
  },
  findBySearch(search: string, speciality: string, hourlyLoad: string) {
    return $axios(PATH_SCHEDULE_SUBJECTS + '?search=' + search, {
      params: {
        speciality,
        hourlyLoad,
      },
    })
  },
})
