import { singletonUseCases } from '../../../application/composition'
import { representation } from '../../../presentation/http/handler-support'
import { profileCreateSchema } from '../../../domain/schemas/profile.schema'
import { parseProfileCreate } from '../../../infrastructure/database/d1/mappers/domain-aggregate-mapper'
import { requireCsrf } from '../../../utils/auth'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await singletonUseCases(event).profile.create.execute({
    userId: auth.user.id,
    value: parseProfileCreate(
      await readValidatedBody(event, profileCreateSchema.parse),
    ),
  })
  return representation(event, result.record, result.revision, result.status)
})
