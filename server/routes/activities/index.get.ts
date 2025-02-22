import { getAuthenticatedUser } from '~/server/utils/auth'
import { useActivityRepository } from '../../provider/activity.repository.provider'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const user = getAuthenticatedUser(event)
    const activityRepository = await useActivityRepository(event)
    const activities = await activityRepository.findAll(user.id)
    return activities
  },
})
