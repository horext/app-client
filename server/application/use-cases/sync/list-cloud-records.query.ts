import type { UseCase } from '../shared/contracts'
import type { ResourceType } from '../../../utils/cloud-types'
import type { CloudReadModel } from './cloud-read-model.port'

export class ListCloudRecordsQuery implements UseCase<
  { userId: string; limit: number; cursor?: string; updatedAfter?: string },
  { items: object[]; nextCursor: string | null }
> {
  constructor(
    private readonly resource: ResourceType,
    private readonly readModel: CloudReadModel,
  ) {}

  execute(input: {
    userId: string
    limit: number
    cursor?: string
    updatedAfter?: string
  }) {
    return this.readModel.list({ ...input, resource: this.resource })
  }
}
