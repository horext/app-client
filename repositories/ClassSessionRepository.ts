import type { $Fetch } from 'nitropack'
import type { ISession } from '~/interfaces/subject'

const PATH_SUBJECTS = 'classSessions'
export class ClassSessionRepository {
  constructor(private $fetch: $Fetch) {}

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
