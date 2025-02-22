import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'
import { getAuthenticatedUser } from '~/server/utils/auth'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const user = getAuthenticatedUser(event)
    const scheduleRepository = await useScheduleRepository(event)
    const schedules = await scheduleRepository.findAll(user.id)
    return schedules
  }
})