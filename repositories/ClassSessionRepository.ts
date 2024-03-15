import type { ISession } from '~/interfaces/subject'
import { BaseRepository } from './BaseRepository'

const PATH_SUBJECTS = 'classSessions'
export class ClassSessionRepository extends BaseRepository {
  findScheduleId(schedule: number) {
    return this.$fetch(PATH_SUBJECTS, {
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
