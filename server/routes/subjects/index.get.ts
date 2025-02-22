import { useSubjectRepository } from '../../provider/subject.repository.provider'

export default defineEventHandler({
  onRequest: authorizeEventRequest,
  handler: async (event) => {
    const subjectRepository = await useSubjectRepository(event)
    const subjects = await subjectRepository.findAll()
    return subjects
  }
})

