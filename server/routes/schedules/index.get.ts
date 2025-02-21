import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'

export default defineEventHandler({
  handler: async (event) => {
    const scheduleRepository = await useScheduleRepository(event)
    const schedules = await scheduleRepository.findAll()
    return schedules
  }
})