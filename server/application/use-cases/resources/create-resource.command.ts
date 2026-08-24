import type { Clock, RepresentationResult, UseCase } from '../shared/contracts'
import { MissingMetadataError } from '../shared/missing-metadata.error'
import { createRecordResult } from './record-result'
import type { IdempotencyPort } from './idempotency.port'
import type { ResourceRevisionReader } from './resource-revision.reader'
import type { ResourceEntity, ResourceService } from './resource.service'

export class CreateResourceCommand<
  Input,
  Entity extends ResourceEntity,
> implements UseCase<
  { userId: string; value: Input; operationId: string },
  RepresentationResult
> {
  constructor(
    private readonly resource: string,
    private readonly service: Pick<
      ResourceService<Input, unknown, Entity>,
      'create'
    >,
    private readonly revisions: ResourceRevisionReader,
    private readonly idempotency: IdempotencyPort,
    private readonly clock: Clock,
    private readonly location: (id: string) => string,
  ) {}

  async execute(input: {
    userId: string
    value: Input
    operationId: string
  }): Promise<RepresentationResult> {
    const now = this.clock.now().toISOString()
    const cached = await this.idempotency.find(
      input.userId,
      input.operationId,
      now,
    )
    if (cached)
      return {
        record: cached as RepresentationResult['record'],
        revision: 1,
        status: 201,
        replayed: true,
      }

    const entity = await this.service.create(input.userId, input.value)
    const id = entity.id
    const revision = await this.revisions.get(input.userId, id)
    if (revision === undefined) throw new MissingMetadataError(this.resource)
    const response = createRecordResult(
      id,
      entity.toSnapshot(),
      revision,
      this.clock,
    )
    await this.idempotency.store(input.userId, input.operationId, now, response)
    return {
      record: response,
      revision,
      status: 201,
      location: this.location(id),
    }
  }
}
