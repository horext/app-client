import { getAuthenticatedUser } from '~/server/utils/auth'
import { useActivityRepository } from '../../provider/activity.repository.provider'
import { readValidatedBody } from 'h3'
import { activitySchema } from '../../schemas/activity.schema'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const { activityId } = getRouterParams(event)
    const body = await readValidatedBody(event, (data) =>
      activitySchema.parse(data),
    )
    const user = getAuthenticatedUser(event)
    const activityRepository = await useActivityRepository(event)

    const result = await activityRepository.updateById(activityId, body, user.id)

    if (!result) {
      return {
        message: 'Activity not found',
        status: 404,
      }
    }

    return {
      status: 'success',
      data: result,
    }
  },
})
