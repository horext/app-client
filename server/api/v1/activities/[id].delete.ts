import { itemQueryUseCases } from '../../../application/composition'
import { uuidSchema } from '../../../domain/schemas/common.schema'
import { requiredRevision } from '../../../presentation/http/handler-support'
import { requireCsrf } from '../../../utils/auth'
import { getValidatedRouterParams, setResponseStatus } from 'h3'
import { z } from 'zod'

const activityIdSchema = z.object({ id: uuidSchema })

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  await itemQueryUseCases(event).activities.delete.execute({
    userId: auth.user.id,
    id: (await getValidatedRouterParams(event, activityIdSchema.parse)).id,
    revision: requiredRevision(event),
  })
  setResponseStatus(event, 204)
  return null
})
