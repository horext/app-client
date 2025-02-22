import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const { scheduleId } = getRouterParams(event)
    const scheduleRepository = await useScheduleRepository(event)

    await scheduleRepository.deleteById(scheduleId)

    return {
      message: 'Schedule deleted successfully',
    }
  }
})
