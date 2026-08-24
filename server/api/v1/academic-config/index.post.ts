import { singletonUseCases } from '../../../application/composition'
import { representation } from '../../../presentation/http/handler-support'
import { academicConfigCreateSchema } from '../../../domain/schemas/academic-config.schema'
import { parseAcademicConfigCreate } from '../../../infrastructure/database/d1/mappers/domain-aggregate-mapper'
import { requireCsrf } from '../../../utils/auth'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await requireCsrf(event)
  const result = await singletonUseCases(event).academicConfig.create.execute({
    userId: auth.user.id,
    value: parseAcademicConfigCreate(
      await readValidatedBody(event, academicConfigCreateSchema.parse),
    ),
  })
  return representation(event, result.record, result.revision, result.status)
})
