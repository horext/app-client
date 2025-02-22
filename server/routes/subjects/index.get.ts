import { getAuthenticatedUser } from '~/server/utils/auth'
import { useSubjectRepository } from '../../provider/subject.repository.provider'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const user = getAuthenticatedUser(event)
    const subjectRepository = await useSubjectRepository(event)
    const subjects = await subjectRepository.findAll(user.id)
    return subjects
  },
})
