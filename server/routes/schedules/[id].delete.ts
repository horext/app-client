import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const { id } = getRouterParams(event)
    const scheduleRepository = await useScheduleRepository(event)

    await scheduleRepository.deleteById(id)

    return {
      message: 'Schedule deleted successfully',
    }
  }
})
