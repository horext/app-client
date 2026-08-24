import { singletonUseCases } from '../../../application/composition'
import {
  representation,
  requiredRevision,
} from '../../../presentation/http/handler-support'
import { academicConfigPatchSchema } from '../../../domain/schemas/academic-config.schema'
import { requireCsrf } from '../../../utils/auth'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await singletonUseCases(event).academicConfig.patch.execute({
    userId: auth.user.id,
    value: await readValidatedBody(event, academicConfigPatchSchema.parse),
    revision: requiredRevision(event),
  })
  return representation(event, result.record, result.revision, result.status)
})
