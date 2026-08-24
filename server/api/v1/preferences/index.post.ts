import { singletonUseCases } from '../../../application/composition'
import { representation } from '../../../presentation/http/handler-support'
import { preferencesCreateSchema } from '../../../domain/schemas/preferences.schema'
import { parsePreferencesCreate } from '../../../infrastructure/database/d1/mappers/domain-aggregate-mapper'
import { requireCsrf } from '../../../utils/auth'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await singletonUseCases(event).preferences.create.execute({
    userId: auth.user.id,
    value: parsePreferencesCreate(
      await readValidatedBody(event, preferencesCreateSchema.parse),
    ),
  })
  return representation(event, result.record, result.revision, result.status)
})
