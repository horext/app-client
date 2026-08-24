import { itemQueryUseCases } from '../../../application/composition'
import { resourceIdSchema } from '../../../domain/schemas/common.schema'
import { representation } from '../../../presentation/http/handler-support'
import { requireAuth } from '../../../utils/auth'
import { getValidatedRouterParams } from 'h3'
import { z } from 'zod'

const idParamsSchema = z.object({ id: resourceIdSchema })

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const result = await itemQueryUseCases(event).schedules.get.execute({
    userId: auth.user.id,
    id: (await getValidatedRouterParams(event, idParamsSchema.parse)).id,
  })
  return representation(event, result.record, result.revision)
})
