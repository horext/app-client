import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'
import { categoryRouteSchema } from '~/server/schemas/category-route.schema'
import { scheduleSchema } from '~/server/schemas/schedule.schema'
import {
  authorizeEventRequest,
  getAuthenticatedUser,
} from '~/server/utils/auth'
import { readValidatedBody } from 'h3'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const user = getAuthenticatedUser(event)
    const body = await readValidatedBody(event, (data) => scheduleSchema.parse(data))
    const params = getRouterParams(event)
    const { categoryCode } = categoryRouteSchema.parse(params)
    const parsedBody = scheduleSchema.parse({
      ...body,
      categories: [categoryCode],
    })
    const scheduleRepository = await useScheduleRepository(event)

    const result = await scheduleRepository.create(parsedBody, user.id)

    return result
  },
})
