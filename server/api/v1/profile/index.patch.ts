import { singletonUseCases } from '../../../application/composition'
import {
  representation,
  requiredRevision,
} from '../../../presentation/http/handler-support'
import { profilePatchSchema } from '../../../domain/schemas/profile.schema'
import { requireCsrf } from '../../../utils/auth'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await singletonUseCases(event).profile.patch.execute({
    userId: auth.user.id,
    value: await readValidatedBody(event, profilePatchSchema.parse),
    revision: requiredRevision(event),
  })
  return representation(event, result.record, result.revision, result.status)
})
