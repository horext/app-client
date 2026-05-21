import type {
  IScheduleSubjectResponse,
  IScheduleSubjectDetailResponse,
} from '../interfaces/schedule-subject'
import { BaseApi } from './base'

export interface IScheduleSubjectApi {
  findBySubjectIdAndHourlyLoadId(
    subject: number,
    hourlyLoad: number,
  ): Promise<IScheduleSubjectResponse[]>
  getAllByIds(ids: Array<number>): Promise<IScheduleSubjectDetailResponse[]>
}

const PATH_SCHEDULE_SUBJECTS = 'scheduleSubjects'

export class ScheduleSubjectApi extends BaseApi implements IScheduleSubjectApi {
  findBySubjectIdAndHourlyLoadId(subject: number, hourlyLoad: number) {
    return this.$fetch<IScheduleSubjectResponse[]>(PATH_SCHEDULE_SUBJECTS, {
      params: {
        subject,
        hourlyLoad,
      },
    })
  }

  getAllByIds(ids: Array<number>) {
    return this.$fetch<IScheduleSubjectDetailResponse[]>(
      PATH_SCHEDULE_SUBJECTS,
      {
        params: {
          ids: ids.join(','),
        },
      },
    )
  }
}
