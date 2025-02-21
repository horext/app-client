import { useSubjectRepository } from '../../provider/subject.repository.provider'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const subjectRepository = await useSubjectRepository(event)

  await subjectRepository.deleteById(id)

  return {
    message: 'Subject deleted successfully',
    status: 200
  } 
})
