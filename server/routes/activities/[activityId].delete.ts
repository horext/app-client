import { getAuthenticatedUser } from '~/server/utils/auth'
import { useActivityRepository } from '../../provider/activity.repository.provider'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const user = getAuthenticatedUser(event)
    const { activityId } = getRouterParams(event)
    const activityRepository = await useActivityRepository(event)

    const isDeleted = await activityRepository.deleteById(activityId, user.id)

    if (!isDeleted) {
      return {
        message: 'Activity not found',
        status: 404,
      }
    }

    return {
      message: 'Activity deleted successfully',
      status: 200,
    }
  },
})
