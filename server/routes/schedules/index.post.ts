import { readValidatedBody } from 'h3'
import { scheduleSchema } from '../../schemas/schedule.schema'
import { useScheduleRepository } from '~/server/provider/schedule.repository.provider'
import { getAuthenticatedUser } from '~/server/utils/auth'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const user = getAuthenticatedUser(event)
    const body = await readValidatedBody(event, (data) =>
      scheduleSchema.parse(data),
    )
    const scheduleRepository = await useScheduleRepository(event)

    const result = await scheduleRepository.create(body, user.id)

    return result
  },
})
