import { itemWriteUseCases } from '../../../application/composition'
import { resourceIdSchema } from '../../../domain/schemas/common.schema'
import { representation } from '../../../presentation/http/handler-support'
import { requireCsrf } from '../../../utils/auth'
import { z } from 'zod'
import { readValidatedBody } from 'h3'

const favoriteCreateSchema = z.object({ scheduleId: resourceIdSchema })

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const body = await readValidatedBody(event, favoriteCreateSchema.parse)
  const result = await itemWriteUseCases(event).favorites.execute({
    userId: auth.user.id,
    id: body.scheduleId,
  })
  return representation(event, result.record, result.revision, result.status)
})
