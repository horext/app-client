import { getAuthenticatedUser } from '~/server/utils/auth'
import { useSubjectRepository } from '../../provider/subject.repository.provider'
import { subjectSchema } from '../../schemas/subject.schema'
import { readValidatedBody } from 'h3'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const body = await readValidatedBody(event, (data) =>
      subjectSchema.parse(data),
    )
    const user = getAuthenticatedUser(event)
    const subjectRepository = await useSubjectRepository(event)

    const result = await subjectRepository.create(body, user.id)

    return {
      status: 'success',
      data: result,
    }
  },
})
