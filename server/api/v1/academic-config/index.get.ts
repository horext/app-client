import { singletonUseCases } from '../../../application/composition'
import { representation } from '../../../presentation/http/handler-support'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const result = await singletonUseCases(event).academicConfig.get.execute({
    userId: auth.user.id,
  })
  return representation(event, result.record, result.revision, result.status)
})
