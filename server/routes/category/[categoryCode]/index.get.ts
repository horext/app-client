import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'
import { categoryRouteSchema } from '~/server/schemas/category-route.schema'

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event)
  const { categoryCode } = categoryRouteSchema.parse(params)
  const scheduleRepository = await useScheduleRepository(event)
  const schedules = await scheduleRepository.findAllByCategory(categoryCode)
  return schedules
})
