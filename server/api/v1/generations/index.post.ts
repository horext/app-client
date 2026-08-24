import { itemCreateUseCases } from '../../../application/composition'
import {
  representation,
  requiredIdempotencyKey,
} from '../../../presentation/http/handler-support'
import { baseGenerationAggregateSchema } from '../../../domain/schemas/generation.schema'
import { requireCsrf } from '../../../utils/auth'
import { parseBaseGeneration } from '../../../infrastructure/database/d1/mappers/domain-aggregate-mapper'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await itemCreateUseCases(event).generations.execute({
    userId: auth.user.id,
    value: parseBaseGeneration(
      await readValidatedBody(event, baseGenerationAggregateSchema.parse),
    ),
    operationId: requiredIdempotencyKey(event),
  })
  if (result.location) setResponseHeader(event, 'location', result.location)
  return representation(event, result.record, result.revision, result.status)
})
