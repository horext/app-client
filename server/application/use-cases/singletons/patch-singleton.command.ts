import type { Clock, RepresentationResult, UseCase } from '../shared/contracts'
import { MissingMetadataError } from '../shared/missing-metadata.error'
import type { SingletonRevisionReader } from './singleton-revision.reader'
import type { SingletonService } from './singleton.service'
import { createSingletonResult } from './singleton-result'

export class PatchSingletonCommand<
  Create,
  Patch,
  Entity extends object,
> implements UseCase<
  { userId: string; value: Patch; revision: number },
  RepresentationResult
> {
  constructor(
    private readonly id: string,
    private readonly service: SingletonService<Create, Patch, Entity>,
    private readonly revisions: SingletonRevisionReader,
    private readonly clock: Clock,
  ) {}

  async execute(input: { userId: string; value: Patch; revision: number }) {
    const entity = await this.service.patch(input.userId, {
      ...input.value,
      revision: input.revision,
    })
    const revision = await this.revisions.get(input.userId)
    if (revision === undefined) throw new MissingMetadataError(this.id)
    return createSingletonResult(this.id, entity, revision, 200, this.clock)
  }
}
