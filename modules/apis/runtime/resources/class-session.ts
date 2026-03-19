import type { ISession } from '~/interfaces/subject'
import { BaseApi } from './base'

const PATH_SUBJECTS = 'classSessions'

export interface IClassSessionApi {
  findScheduleId(schedule: number): Promise<ISession[]>
  findScheduleIds(schedulesIds: Array<number>): Promise<ISession[]>
}

export class ClassSessionApi extends BaseApi implements IClassSessionApi {
  findScheduleId(schedule: number) {
    return this.$fetch<ISession[]>(PATH_SUBJECTS, {
      method: 'GET',
      params: {
        schedule,
      },
    })
  }

  findScheduleIds(schedulesIds: Array<number>) {
    return this.$fetch<ISession[]>(PATH_SUBJECTS, {
      method: 'GET',
      params: {
        schedules: schedulesIds.join(','),
      },
    })
  }
}
