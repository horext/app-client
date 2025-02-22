import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'
import { getAuthenticatedUser } from '~/server/utils/auth'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const { scheduleId } = getRouterParams(event)
    const user = getAuthenticatedUser(event)
    const scheduleRepository = await useScheduleRepository(event)

    await scheduleRepository.deleteById(scheduleId, user.id)

    return {
      message: 'Schedule deleted successfully',
    }
  },
})
