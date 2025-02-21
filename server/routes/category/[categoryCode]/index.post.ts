import { readBody } from 'h3'
import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'
import { categoryRouteSchema } from '~/server/schemas/category-route.schema'
import { baseScheduleSchema } from '~/server/schemas/schedule.schema'

export default defineEventHandler({
  handler: async (event) => {
    const body = await readBody(event)
    const params = getRouterParams(event)
    const { categoryCode } = categoryRouteSchema.parse(params)
    const parsedBody = baseScheduleSchema.parse(body)
    const scheduleRepository = await useScheduleRepository(event)

    const result = await scheduleRepository.create({
      ...parsedBody,
      categories: [categoryCode],
    })

    return result
  }
})
