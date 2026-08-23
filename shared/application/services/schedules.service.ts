import {
  GeneratedSchedule,
  type IGeneratedScheduleCreate,
  type GeneratedScheduleId,
} from '#shared/domain'
import type { ISchedulesRepository } from '../repositories/schedules.repository'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'

export class SchedulesService {
  constructor(private readonly repository: ISchedulesRepository) {}

  get(userId: string, id: GeneratedScheduleId) {
    return this.repository.findBy(userId, id)
  }

  create(
    userId: string,
    value: IGeneratedScheduleCreate,
    id?: GeneratedScheduleId,
  ) {
    return this.repository.create(
      userId,
      GeneratedSchedule.create({
        ...value,
        ...(id ? { externalId: id } : {}),
      }),
    )
  }

  async patch(
    userId: string,
    id: GeneratedScheduleId,
    value: { revision: number },
  ) {
    const current = await this.get(userId, id)
    if (!current) throw new ResourceNotFoundError('schedule')
    current.update(value)
    return this.repository.update(userId, current)
  }

  delete(userId: string, id: GeneratedScheduleId, revision: number) {
    return this.repository.deleteEntry(userId, id, revision)
  }
}
