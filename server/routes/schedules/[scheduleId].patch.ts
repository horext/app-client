import { readBody } from 'h3'
import { scheduleSchema } from '../../schemas/schedule.schema'
import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'
import { getAuthenticatedUser } from '~/server/utils/auth'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const { scheduleId } = getRouterParams(event)
    const user = getAuthenticatedUser(event)
    const body = await readBody(event)
    const parsedBody = scheduleSchema.partial().parse(body)
    const scheduleRepository = await useScheduleRepository(event)

    const result = await scheduleRepository.partialUpdateById(
      scheduleId,
      parsedBody,
      user.id,
    )

    return result
  },
})
