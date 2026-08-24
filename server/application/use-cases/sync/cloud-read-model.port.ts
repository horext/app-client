import type { CloudRecordRow, ResourceType } from '../../../utils/cloud-types'

export interface CloudReadModel {
  list(input: {
    userId: string
    resource: ResourceType
    limit: number
    cursor?: string
    updatedAfter?: string
  }): Promise<{ items: object[]; nextCursor: string | null }>
  changes(input: {
    userId: string
    cursor: number
    limit: number
  }): Promise<{ rows: ChangeRow[]; hasMore: boolean }>
  find(input: {
    userId: string
    resource: ResourceType
    id: string
    includeDeleted?: boolean
  }): Promise<CloudRecordRow | null>
}

export interface ChangeRow {
  sequence: number
  resourceType: ResourceType
  recordId: string
  revision: number
  operation: 'upsert' | 'delete'
  changedAt: string
}
