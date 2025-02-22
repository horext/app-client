import { getAuthenticatedUser } from '~/server/utils/auth'
import { useSubjectRepository } from '../../provider/subject.repository.provider'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const user = getAuthenticatedUser(event)
    const { subjectId } = getRouterParams(event)
    const subjectRepository = await useSubjectRepository(event)

   const isDeleted = await subjectRepository.deleteById(subjectId, user.id)

    if (!isDeleted) {
      return {
        message: 'Subject not found',
        status: 404,
      }
    }

    return {
      message: 'Subject deleted successfully',
      status: 200,
    }
  },
})
