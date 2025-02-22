import { getAuthenticatedUser } from '~/server/utils/auth'
import { useSubjectRepository } from '../../provider/subject.repository.provider'
import { subjectSchema } from '../../schemas/subject.schema'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const body = await readBody(event)
    const parsedBody = subjectSchema.parse(body)
    const user = getAuthenticatedUser(event)
    const subjectRepository = await useSubjectRepository(event)

    const result = await subjectRepository.create(parsedBody, user.id)

    return {
      status: 'success',
      data: result,
    }
  },
})
