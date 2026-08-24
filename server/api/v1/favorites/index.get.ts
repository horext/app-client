import { requireAuth } from '../../../utils/auth'
import { cloudQueryUseCases } from '../../../application/composition'
import { validatedCloudCollectionQuery } from '../../../presentation/http/handler-support'
export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  return cloudQueryUseCases(event).favorites.execute({
    userId: auth.user.id,
    ...validatedCloudCollectionQuery(event),
  })
})
