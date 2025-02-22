import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'
import { scheduleRouteSchema } from '~/server/schemas/schedule-route.schema'
import { getAuthenticatedUser } from '~/server/utils/auth'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const { scheduleId } = await getValidatedRouterParams(event, (data) =>
      scheduleRouteSchema.parse(data),
    )
    const user = getAuthenticatedUser(event)
    const scheduleRepository = await useScheduleRepository(event)

    await scheduleRepository.deleteById(scheduleId, user.id)

    return {
      message: 'Schedule deleted successfully',
    }
  },
})
