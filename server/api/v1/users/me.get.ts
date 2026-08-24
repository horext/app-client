import { requireAuth } from '../../../utils/auth'
import { sessionUseCases } from '../../../application/composition'

export default defineEventHandler(async (event) => {
  return sessionUseCases(event).user.execute(await requireAuth(event))
})
