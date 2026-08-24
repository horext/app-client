import { itemCreateUseCases } from '../../../application/composition'
import {
  representation,
  requiredIdempotencyKey,
} from '../../../presentation/http/handler-support'
import { baseScheduleAggregateSchema } from '../../../domain/schemas/schedule.schema'
import { requireCsrf } from '../../../utils/auth'
import { parseBaseSchedule } from '../../../infrastructure/database/d1/mappers/domain-aggregate-mapper'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await itemCreateUseCases(event).schedules.execute({
    userId: auth.user.id,
    value: parseBaseSchedule(
      await readValidatedBody(event, baseScheduleAggregateSchema.parse),
    ),
    operationId: requiredIdempotencyKey(event),
  })
  if (result.location) setResponseHeader(event, 'location', result.location)
  return representation(event, result.record, result.revision, result.status)
})
