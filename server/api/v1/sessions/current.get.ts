import { requireAuth } from '../../../utils/auth'
import { sessionUseCases } from '../../../application/composition'

export default defineEventHandler(async (event) => {
  return sessionUseCases(event).current.execute(await requireAuth(event))
})
