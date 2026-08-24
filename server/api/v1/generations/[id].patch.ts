import { itemWriteUseCases } from '../../../application/composition'
import { resourceIdSchema } from '../../../domain/schemas/common.schema'
import {
  representation,
  requiredRevision,
} from '../../../presentation/http/handler-support'
import { generationAggregatePatchSchema } from '../../../domain/schemas/generation.schema'
import { requireCsrf } from '../../../utils/auth'
import { getValidatedRouterParams, readValidatedBody } from 'h3'
import { z } from 'zod'

const idParamsSchema = z.object({
  id: resourceIdSchema,
})

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await itemWriteUseCases(event).generations.patch.execute({
    userId: auth.user.id,
    id: (await getValidatedRouterParams(event, idParamsSchema.parse)).id,
    value: await readValidatedBody(event, generationAggregatePatchSchema.parse),
    revision: requiredRevision(event),
  })
  return representation(event, result.record, result.revision, result.status)
})
