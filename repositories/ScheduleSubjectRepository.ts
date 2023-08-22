import { AxiosInstance } from 'axios'
import { IScheduleSubject } from '~/interfaces/schedule-subject'

const PATH_SCHEDULE_SUBJECTS = 'scheduleSubjects'
export default ($axios: AxiosInstance) => ({
  findBySubjectIdAndHourlyLoadId(subject: number, hourlyLoad: number) {
    return $axios.get<IScheduleSubject[]>(PATH_SCHEDULE_SUBJECTS, {
      params: {
        subject,
        hourlyLoad,
      },
    })
  },
  getAllByIds(ids: Array<number>) {
    return $axios.get(PATH_SCHEDULE_SUBJECTS, {
      params: {
        ids: ids.join(','),
      },
    })
  },
  findBySearch(search: string, speciality: string, hourlyLoad: string) {
    return $axios.get(PATH_SCHEDULE_SUBJECTS + '?search=' + search, {
      params: {
        speciality,
        hourlyLoad,
      },
    })
  },
})
