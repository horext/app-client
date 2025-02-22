import { getAuthenticatedUser } from '~/server/utils/auth'
import { useActivityRepository } from '../../provider/activity.repository.provider'
import { readValidatedBody } from 'h3'
import { activitySchema } from '../../schemas/activity.schema'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const body = await readValidatedBody(event, (data) =>
      activitySchema.parse(data),
    )
    const user = getAuthenticatedUser(event)
    const activityRepository = await useActivityRepository(event)

    const result = await activityRepository.create(body, user.id)

    return {
      status: 'success',
      data: result,
    }
  },
})
