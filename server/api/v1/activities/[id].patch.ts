import { itemWriteUseCases } from '../../../application/composition'
import {
  representation,
  requiredRevision,
} from '../../../presentation/http/handler-support'
import { activityPatchSchema } from '../../../domain/schemas/activity.schema'
import { uuidSchema } from '../../../domain/schemas/common.schema'
import { requireCsrf } from '../../../utils/auth'
import { getValidatedRouterParams, readValidatedBody } from 'h3'
import { z } from 'zod'

const activityIdSchema = z.object({ id: uuidSchema })

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await itemWriteUseCases(event).activities.patch.execute({
    userId: auth.user.id,
    id: (await getValidatedRouterParams(event, activityIdSchema.parse)).id,
    value: await readValidatedBody(event, activityPatchSchema.parse),
    revision: requiredRevision(event),
  })
  return representation(event, result.record, result.revision, result.status)
})
