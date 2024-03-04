import type {
  IScheduleSubject,
  IScheduleSubjectSessionDetail,
} from '~/interfaces/schedule-subject'
import { BaseRepository } from './BaseRepository'

const PATH_SCHEDULE_SUBJECTS = 'scheduleSubjects'
export class ScheduleSubjectRepository extends BaseRepository {
  findBySubjectIdAndHourlyLoadId(subject: number, hourlyLoad: number) {
    return this.$fetch<IScheduleSubject[]>(PATH_SCHEDULE_SUBJECTS, {
      params: {
        subject,
        hourlyLoad,
      },
    })
  }

  getAllByIds(ids: Array<number>) {
    return this.$fetch<IScheduleSubjectSessionDetail[]>(
      PATH_SCHEDULE_SUBJECTS,
      {
        params: {
          ids: ids.join(','),
        },
      },
    )
  }

  findBySearch(search: string, speciality: string, hourlyLoad: string) {
    return this.$fetch(PATH_SCHEDULE_SUBJECTS, {
      params: {
        speciality,
        hourlyLoad,
        search: search,
      },
    })
  }
}
