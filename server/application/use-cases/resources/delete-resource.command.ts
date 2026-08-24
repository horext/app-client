import type { UseCase } from '../shared/contracts'
import type { ResourceEntity, ResourceService } from './resource.service'

export class DeleteResourceCommand<
  Entity extends ResourceEntity,
> implements UseCase<{ userId: string; id: string; revision: number }, void> {
  constructor(
    private readonly service: Pick<
      ResourceService<unknown, unknown, Entity>,
      'delete'
    >,
  ) {}

  execute(input: { userId: string; id: string; revision: number }) {
    return this.service.delete(input.userId, input.id, input.revision)
  }
}
