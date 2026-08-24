import { singletonUseCases } from '../../../application/composition'
import {
  representation,
  requiredRevision,
} from '../../../presentation/http/handler-support'
import { preferencesPatchSchema } from '../../../domain/schemas/preferences.schema'
import { requireCsrf } from '../../../utils/auth'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await singletonUseCases(event).preferences.patch.execute({
    userId: auth.user.id,
    value: await readValidatedBody(event, preferencesPatchSchema.parse),
    revision: requiredRevision(event),
  })
  return representation(event, result.record, result.revision, result.status)
})
