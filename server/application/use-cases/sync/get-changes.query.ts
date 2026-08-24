import type { UseCase } from '../shared/contracts'
import type { ResourceType } from '../../../utils/cloud-types'
import type { CloudReadModel } from './cloud-read-model.port'
import { encodeCursor } from './cursor'

export class GetChangesQuery implements UseCase<
  { userId: string; cursor: number; limit: number },
  Record<string, unknown>
> {
  constructor(private readonly readModel: CloudReadModel) {}

  async execute(input: { userId: string; cursor: number; limit: number }) {
    const result = await this.readModel.changes(input)
    const feed: Record<ResourceType, object[]> = {
      profile: [],
      preferences: [],
      'academic-config': [],
      activities: [],
      subjects: [],
      schedules: [],
      generations: [],
      favorites: [],
    }
    for (const change of result.rows) {
      const record = await this.readModel.find({
        userId: input.userId,
        resource: change.resourceType,
        id: change.recordId,
        includeDeleted: true,
      })
      feed[change.resourceType].push({
        sequence: change.sequence,
        id: change.recordId,
        operation: change.operation,
        revision: change.revision,
        etag: `"${change.revision}"`,
        data:
          change.operation === 'delete' || !record?.payload
            ? null
            : JSON.parse(record.payload),
        changedAt: change.changedAt,
        deletedAt: record?.deleted_at ?? null,
      })
    }
    const next = encodeCursor(result.rows.at(-1)?.sequence ?? input.cursor)
    return {
      profile: feed.profile,
      preferences: feed.preferences,
      academicConfig: feed['academic-config'],
      activities: feed.activities,
      subjects: feed.subjects,
      schedules: feed.schedules,
      generations: feed.generations,
      favorites: feed.favorites,
      cursor: next,
      hasMore: result.hasMore,
    }
  }
}
