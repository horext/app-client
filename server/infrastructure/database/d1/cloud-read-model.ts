import type {
  ChangeRow,
  CloudReadModel,
} from '../../../application/use-cases/sync'
import type {
  CloudflareD1Database,
  CloudRecordRow,
  ResourceType,
} from '../../../utils/cloud-types'

const TABLES: Record<ResourceType, string> = {
  profile: 'profiles',
  preferences: 'preferences',
  'academic-config': 'academic_configs',
  activities: 'activities',
  subjects: 'user_subjects',
  schedules: 'schedules',
  generations: 'generations',
  favorites: 'favorites',
}
const IDS: Record<ResourceType, string> = {
  profile: "'profile'",
  preferences: "'preferences'",
  'academic-config': "'academic-config'",
  activities: 'local_id',
  subjects: 'local_id',
  schedules: 'local_id',
  generations: 'local_id',
  favorites: 'local_id',
}
const SINGLETONS = new Set<ResourceType>([
  'profile',
  'preferences',
  'academic-config',
])

function selectSql(resource: ResourceType, includeDeleted: boolean) {
  return `SELECT user_id, '${resource}' resource_type, ${IDS[resource]} record_id, payload_json payload, revision, created_at, updated_at, deleted_at FROM ${TABLES[resource]} WHERE user_id=? ${includeDeleted ? '' : 'AND deleted_at IS NULL'}`
}

function serialize(row: CloudRecordRow) {
  return {
    id: row.record_id,
    resource: row.resource_type,
    data: row.payload ? JSON.parse(row.payload) : null,
    revision: row.revision,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  }
}

export class D1CloudReadModel implements CloudReadModel {
  constructor(private readonly database: CloudflareD1Database) {}

  async list(input: {
    userId: string
    resource: ResourceType
    limit: number
    cursor?: string
    updatedAfter?: string
  }) {
    let after = ''
    let afterId = ''
    if (input.cursor) {
      const cursor = JSON.parse(
        new TextDecoder().decode(
          Uint8Array.from(
            atob(input.cursor.replace(/-/g, '+').replace(/_/g, '/')),
            (character) => character.charCodeAt(0),
          ),
        ),
      ) as unknown
      if (
        !Array.isArray(cursor) ||
        cursor.length !== 2 ||
        typeof cursor[0] !== 'string' ||
        typeof cursor[1] !== 'string'
      )
        throw new Error('Invalid cursor.')
      after = cursor[0]
      afterId = cursor[1]
    }
    const sql =
      selectSql(input.resource, false) +
      ` AND updated_at>=? AND (updated_at>? OR (updated_at=? AND ${IDS[input.resource]}>?)) ORDER BY updated_at,${IDS[input.resource]} LIMIT ?`
    const result = await this.database
      .prepare(sql)
      .bind(
        input.userId,
        input.updatedAfter ?? '',
        after,
        after,
        afterId,
        input.limit + 1,
      )
      .all<CloudRecordRow>()
    const rows = result.results ?? []
    const page = rows.slice(0, input.limit)
    const last = page.at(-1)
    const nextCursor =
      rows.length > input.limit && last
        ? btoa(JSON.stringify([last.updated_at, last.record_id]))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
        : null
    return { items: page.map(serialize), nextCursor }
  }

  async changes(input: { userId: string; cursor: number; limit: number }) {
    const result = await this.database
      .prepare(
        'SELECT sequence,resource_type,record_id,revision,operation,changed_at FROM changes WHERE user_id=? AND sequence>? ORDER BY sequence LIMIT ?',
      )
      .bind(input.userId, input.cursor, input.limit + 1)
      .all<{
        sequence: number
        resource_type: ResourceType
        record_id: string
        revision: number
        operation: 'upsert' | 'delete'
        changed_at: string
      }>()
    const rows = result.results ?? []
    return {
      rows: rows.slice(0, input.limit).map((row): ChangeRow => ({
        sequence: row.sequence,
        resourceType: row.resource_type,
        recordId: row.record_id,
        revision: row.revision,
        operation: row.operation,
        changedAt: row.changed_at,
      })),
      hasMore: rows.length > input.limit,
    }
  }

  async find(input: {
    userId: string
    resource: ResourceType
    id: string
    includeDeleted?: boolean
  }) {
    const idClause = SINGLETONS.has(input.resource)
      ? ''
      : ` AND ${IDS[input.resource]}=?`
    const statement = this.database.prepare(
      selectSql(input.resource, Boolean(input.includeDeleted)) + idClause,
    )
    return (
      SINGLETONS.has(input.resource)
        ? statement.bind(input.userId)
        : statement.bind(input.userId, input.id)
    ).first<CloudRecordRow>()
  }
}
