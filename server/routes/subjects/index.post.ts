import { useSubjectRepository } from '../../provider/subject.repository.provider'
import { subjectSchema } from '../../schemas/subject.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsedBody = subjectSchema.parse(body)
  const subjectRepository = await useSubjectRepository(event)

  const result = await subjectRepository.create(parsedBody)

  return {
    status: 'success',
    data: result,
  }
})
