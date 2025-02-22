import { getAuthenticatedUser } from '~/server/utils/auth'
import { useSubjectRepository } from '../../provider/subject.repository.provider'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const user = getAuthenticatedUser(event)
    const { subjectId } = getRouterParams(event)
    const subjectRepository = await useSubjectRepository(event)

    await subjectRepository.deleteById(subjectId, user.id)

    return {
      message: 'Subject deleted successfully',
      status: 200,
    }
  },
})
