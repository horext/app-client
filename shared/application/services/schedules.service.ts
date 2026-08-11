import type { UUID } from 'crypto'
import { Schedule } from '#shared/domain'
import type { ISchedulesRepository } from '../repositories/schedules.repository'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'

export class SchedulesService {
  constructor(private readonly repository: ISchedulesRepository) {}

  get(userId: string, id: string) {
    return this.repository.findBy(userId, id as UUID)
  }

  create(userId: string, value: unknown, id?: string) {
    return this.repository.create(
      userId,
      Schedule.create({
        ...(value as Parameters<typeof Schedule.create>[0]),
        ...(id ? { externalId: id as UUID } : {}),
      }),
    )
  }

  async patch(userId: string, id: UUID, value: { revision: number }) {
    const current = await this.get(userId, id)
    if (!current) throw new ResourceNotFoundError('schedule')
    return this.repository.update(userId, current.update(value))
  }

  delete(userId: string, id: UUID, revision: number) {
    return this.repository.deleteEntry(userId, id, revision)
  }
}
