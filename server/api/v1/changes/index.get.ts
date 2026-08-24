import { cloudQueryUseCases } from '../../../application/composition'
import { decodeCursor } from '../../../application/use-cases/sync'
import { requireAuth } from '../../../utils/auth'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const query = getQuery(event)
  let cursor: number
  try {
    cursor = decodeCursor(
      query.cursor === undefined ? undefined : String(query.cursor),
    )
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'The change cursor is invalid.',
      data: { code: 'invalid-cursor' },
    })
  }
  const limit = Math.min(500, Math.max(1, Number(query.limit) || 100))
  return cloudQueryUseCases(event).changes.execute({
    userId: auth.user.id,
    cursor,
    limit,
  })
})
