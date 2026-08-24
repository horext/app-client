import type { IdempotencyPort } from '../../../application/use-cases/resources'
import type { CloudflareD1Database } from '../../../utils/cloud-types'

export class D1IdempotencyStore implements IdempotencyPort {
  constructor(private readonly database: CloudflareD1Database) {}

  async find(userId: string, operationId: string, now: string) {
    const cached = await this.database
      .prepare(
        'SELECT response_body FROM processed_operations WHERE user_id=? AND operation_id=? AND expires_at>?',
      )
      .bind(userId, operationId, now)
      .first<{ response_body: string }>()
    return cached
      ? (JSON.parse(cached.response_body) as Record<string, unknown>)
      : undefined
  }

  async store(userId: string, operationId: string, now: string, value: object) {
    await this.database
      .prepare('INSERT INTO processed_operations VALUES(?,?,?,?,?)')
      .bind(
        userId,
        operationId,
        JSON.stringify(value),
        now,
        new Date(new Date(now).getTime() + 86_400_000).toISOString(),
      )
      .run()
  }
}
