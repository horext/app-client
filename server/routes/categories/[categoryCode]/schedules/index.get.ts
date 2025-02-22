import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'
import { categoryRouteSchema } from '~/server/schemas/category-route.schema'
import {
  authorizeEventRequest,
  getAuthenticatedUser,
} from '~/server/utils/auth'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const user = getAuthenticatedUser(event)
    const { categoryCode } = await getValidatedRouterParams(event, (data) =>
      categoryRouteSchema.parse(data),
    )
    const scheduleRepository = await useScheduleRepository(event)
    const schedules = await scheduleRepository.findAllByCategory(
      categoryCode,
      user.id,
    )
    return schedules
  },
})
