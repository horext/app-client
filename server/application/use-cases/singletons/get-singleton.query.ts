import type { Clock, RepresentationResult, UseCase } from '../shared/contracts'
import { ResourceNotFoundError } from '../shared/resource-not-found.error'
import type { SingletonRevisionReader } from './singleton-revision.reader'
import type { SingletonService } from './singleton.service'
import { createSingletonResult } from './singleton-result'

export class GetSingletonQuery<
  Create,
  Patch,
  Entity extends object,
> implements UseCase<{ userId: string }, RepresentationResult> {
  constructor(
    private readonly id: string,
    private readonly service: SingletonService<Create, Patch, Entity>,
    private readonly revisions: SingletonRevisionReader,
    private readonly clock: Clock,
  ) {}

  async execute({ userId }: { userId: string }) {
    const entity = await this.service.get(userId)
    if (!entity) throw new ResourceNotFoundError(this.id)
    const revision = await this.revisions.get(userId)
    if (revision === undefined) throw new ResourceNotFoundError(this.id)
    return createSingletonResult(this.id, entity, revision, 200, this.clock)
  }
}
