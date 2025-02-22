import { readValidatedBody } from 'h3'
import { scheduleSchema } from '../../schemas/schedule.schema'
import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'
import { getAuthenticatedUser } from '~/server/utils/auth'
import { scheduleRouteSchema } from '~/server/schemas/schedule-route.schema'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const { scheduleId } = await getValidatedRouterParams(event, (data) =>
      scheduleRouteSchema.parse(data),
    )
    const user = getAuthenticatedUser(event)
    const body = await readValidatedBody(event, (data) =>
      scheduleSchema.partial().parse(data),
    )
    const scheduleRepository = await useScheduleRepository(event)

    const result = await scheduleRepository.partialUpdateById(
      scheduleId,
      body,
      user.id,
    )

    if (!result) {
      return {
        message: 'Schedule not found',
        status: 404,
      }
    }

    return result
  },
})
