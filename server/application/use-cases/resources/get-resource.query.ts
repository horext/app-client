import type { Clock, RepresentationResult, UseCase } from '../shared/contracts'
import { ResourceNotFoundError } from '../shared/resource-not-found.error'
import { createRecordResult } from './record-result'
import type { ResourceRevisionReader } from './resource-revision.reader'
import type { ResourceEntity, ResourceService } from './resource.service'

export class GetResourceQuery<T extends ResourceEntity> implements UseCase<
  { userId: string; id: string },
  RepresentationResult
> {
  constructor(
    private readonly resource: string,
    private readonly service: Pick<ResourceService<unknown, unknown, T>, 'get'>,
    private readonly revisions: ResourceRevisionReader,
    private readonly clock: Clock,
  ) {}

  async execute(input: { userId: string; id: string }) {
    const entity = await this.service.get(input.userId, input.id)
    if (!entity) throw new ResourceNotFoundError(this.resource)
    const revision = await this.revisions.get(input.userId, input.id)
    if (revision === undefined) throw new ResourceNotFoundError(this.resource)
    return {
      record: createRecordResult(
        input.id,
        entity.toSnapshot(),
        revision,
        this.clock,
      ),
      revision,
      status: 200,
    }
  }
}
