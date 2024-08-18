import type {
  IScheduleSubject,
  IScheduleSubjectSessionDetail,
} from '~/interfaces/schedule-subject'
import { BaseApi } from './base'

export interface IScheduleSubjectApi {
  findBySubjectIdAndHourlyLoadId(
    subject: number,
    hourlyLoad: number,
  ): Promise<IScheduleSubject[]>
  getAllByIds(ids: Array<number>): Promise<IScheduleSubjectSessionDetail[]>
  findBySearch(
    search: string,
    speciality: string,
    hourlyLoad: string,
  ): Promise<IScheduleSubject[]>
}

const PATH_SCHEDULE_SUBJECTS = 'scheduleSubjects'

export class ScheduleSubjectApi extends BaseApi implements IScheduleSubjectApi {
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
    return this.$fetch<IScheduleSubject[]>(PATH_SCHEDULE_SUBJECTS, {
      params: {
        speciality,
        hourlyLoad,
        search: search,
      },
    })
  }
}
