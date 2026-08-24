import type { Clock, RepresentationResult, UseCase } from '../shared/contracts'
import { MissingMetadataError } from '../shared/missing-metadata.error'
import type { ResourceRevisionReader } from './resource-revision.reader'
import type { ResourceEntity, ResourceService } from './resource.service'
import { createRepresentationResult } from './representation-result'

export class PatchItemCommand<
  Create,
  Patch,
  Entity extends ResourceEntity,
> implements UseCase<
  { userId: string; id: string; value: Patch; revision: number },
  RepresentationResult
> {
  constructor(
    private readonly resource: string,
    private readonly service: ResourceService<Create, Patch, Entity>,
    private readonly revisions: ResourceRevisionReader,
    private readonly clock: Clock,
  ) {}

  async execute(input: {
    userId: string
    id: string
    value: Patch
    revision: number
  }) {
    const saved = await this.service.patch(input.userId, input.id, {
      ...input.value,
      revision: input.revision,
    })
    const revision = await this.revisions.get(input.userId, input.id)
    if (revision === undefined) throw new MissingMetadataError(this.resource)
    return createRepresentationResult(
      input.id,
      saved.toSnapshot(),
      revision,
      200,
      this.clock,
    )
  }
}
