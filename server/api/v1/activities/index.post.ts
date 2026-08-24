import { itemCreateUseCases } from '../../../application/composition'
import {
  representation,
  requiredIdempotencyKey,
} from '../../../presentation/http/handler-support'
import { baseActivitySchema } from '../../../domain/schemas/activity.schema'
import { requireCsrf } from '../../../utils/auth'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await itemCreateUseCases(event).activities.execute({
    userId: auth.user.id,
    value: await readValidatedBody(event, baseActivitySchema.parse),
    operationId: requiredIdempotencyKey(event),
  })
  if (result.location) setResponseHeader(event, 'location', result.location)
  return representation(event, result.record, result.revision, result.status)
})
