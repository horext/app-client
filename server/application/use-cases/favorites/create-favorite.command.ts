import type { Clock, RepresentationResult, UseCase } from '../shared/contracts'
import { MissingMetadataError } from '../shared/missing-metadata.error'
import { MissingReferenceError } from '../shared/missing-reference.error'
import { createRepresentationResult } from '../resources/representation-result'
import type { FavoriteRevisionReader } from './favorite-revision.reader'
import type { FavoriteEntity, FavoriteService } from './favorite.service'

export class CreateFavoriteCommand<
  Entity extends FavoriteEntity,
> implements UseCase<{ userId: string; id: string }, RepresentationResult> {
  constructor(
    private readonly service: FavoriteService<Entity>,
    private readonly revisions: FavoriteRevisionReader,
    private readonly clock: Clock,
  ) {}

  async execute(input: { userId: string; id: string }) {
    const current = await this.service.get(input.userId, input.id)
    if (current) {
      const revision = await this.revisions.get(input.userId, input.id)
      if (revision === undefined) throw new MissingMetadataError('favorite')
      return createRepresentationResult(
        input.id,
        current.toSnapshot(),
        revision,
        200,
        this.clock,
      )
    }
    if (!(await this.service.scheduleExists(input.userId, input.id)))
      throw new MissingReferenceError(
        'schedule',
        'A favorite must reference an existing schedule.',
      )
    const saved = await this.service.create(input.userId, input.id)
    const revision = await this.revisions.get(input.userId, input.id)
    if (revision === undefined) throw new MissingMetadataError('favorite')
    return createRepresentationResult(
      input.id,
      saved.toSnapshot(),
      revision,
      201,
      this.clock,
    )
  }
}
