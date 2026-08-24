import { itemCreateUseCases } from '../../../application/composition'
import {
  representation,
  requiredIdempotencyKey,
} from '../../../presentation/http/handler-support'
import { baseSubjectAggregateSchema } from '../../../domain/schemas/subject.schema'
import { requireCsrf } from '../../../utils/auth'
import { parseBaseSubject } from '../../../infrastructure/database/d1/mappers/domain-aggregate-mapper'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await itemCreateUseCases(event).subjects.execute({
    userId: auth.user.id,
    value: parseBaseSubject(
      await readValidatedBody(event, baseSubjectAggregateSchema.parse),
    ),
    operationId: requiredIdempotencyKey(event),
  })
  if (result.location) setResponseHeader(event, 'location', result.location)
  return representation(event, result.record, result.revision, result.status)
})
