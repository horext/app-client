import { useDatabase } from '../../utils/db'
import { parseJsonObject } from '../../utils/json'
import { createError, setResponseStatus, type H3Event } from 'h3'

export function requiredRevision(event: H3Event): number {
  const value = getHeader(event, 'if-match')
  if (!value)
    throw createError({
      statusCode: 428,
      statusMessage: 'Precondition Required',
      message: 'An If-Match header is required.',
      data: { code: 'if-match-required' },
    })
  const match = /^"(\d+)"$/.exec(value)
  if (!match)
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'If-Match must contain a revision ETag.',
      data: { code: 'invalid-if-match' },
    })
  return Number(match[1])
}

export function representation(
  event: H3Event,
  value: object,
  revision: number,
  status = 200,
) {
  setResponseStatus(event, status)
  setResponseHeader(event, 'etag', `"${revision}"`)
  return value
}

export function record(id: string, data: object, revision: number) {
  const now = new Date().toISOString()
  const createdAt =
    'createdAt' in data && typeof data.createdAt === 'string'
      ? data.createdAt
      : now
  const updatedAt =
    'updatedAt' in data && typeof data.updatedAt === 'string'
      ? data.updatedAt
      : now
  return { id, data, revision, createdAt, updatedAt, deletedAt: null }
}

export function replacementMetadata(
  current: { createdAt: string; createdBy: string } | undefined,
  userId: string,
): {
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
} {
  const now = new Date().toISOString()
  return {
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
    createdBy: current?.createdBy ?? userId,
    updatedBy: userId,
  }
}

export function notFound(_event: H3Event, name: string): never {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The ${name} does not exist.`,
    data: { code: 'resource-not-found' },
  })
}

export async function idempotency(event: H3Event, userId: string) {
  const operationId = getHeader(event, 'idempotency-key')
  if (!operationId || operationId.length > 128)
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'A valid Idempotency-Key header is required.',
      data: { code: 'idempotency-key-required' },
    })
  const now = new Date().toISOString()
  const cached = await useDatabase(event)
    .prepare(
      'SELECT response_body FROM processed_operations WHERE user_id=? AND operation_id=? AND expires_at>?',
    )
    .bind(userId, operationId, now)
    .first<{ response_body: string }>()
  return {
    operationId,
    now,
    cached: cached ? parseJsonObject(cached.response_body) : undefined,
  }
}

export function requiredIdempotencyKey(event: H3Event): string {
  const operationId = getHeader(event, 'idempotency-key')
  if (!operationId || operationId.length > 128)
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'A valid Idempotency-Key header is required.',
      data: { code: 'idempotency-key-required' },
    })
  return operationId
}

export function validatedCloudCollectionQuery(event: H3Event): {
  limit: number
  cursor?: string
  updatedAfter?: string
} {
  const query = getQuery(event)
  const cursor = typeof query.cursor === 'string' ? query.cursor : undefined
  if (cursor)
    try {
      const decoded = JSON.parse(
        new TextDecoder().decode(
          Uint8Array.from(
            atob(cursor.replace(/-/g, '+').replace(/_/g, '/')),
            (character) => character.charCodeAt(0),
          ),
        ),
      ) as unknown
      if (
        !Array.isArray(decoded) ||
        decoded.length !== 2 ||
        typeof decoded[0] !== 'string' ||
        typeof decoded[1] !== 'string'
      )
        throw new Error('Invalid cursor shape.')
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'The pagination cursor is invalid.',
        data: { code: 'invalid-cursor' },
      })
    }
  return {
    limit: Math.min(500, Math.max(1, Number(query.limit) || 100)),
    cursor,
    updatedAfter:
      typeof query.updatedAfter === 'string' ? query.updatedAfter : undefined,
  }
}

export async function storeIdempotency(
  event: H3Event,
  userId: string,
  operationId: string,
  now: string,
  value: object,
) {
  await useDatabase(event)
    .prepare('INSERT INTO processed_operations VALUES(?,?,?,?,?)')
    .bind(
      userId,
      operationId,
      JSON.stringify(value),
      now,
      new Date(Date.now() + 86_400_000).toISOString(),
    )
    .run()
}
