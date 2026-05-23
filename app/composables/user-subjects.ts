import type { UUID } from 'crypto'
import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
} from '~/interfaces/subject'

export const useUserSubjects = () => {
  const service = useSubjectsService()
  const store = useUserSubjectsStore()
  const { subjects } = storeToRefs(store)

  async function saveNewSubject(_subject: IBaseSubjectSchedules) {
    const created = await service.create(_subject)
    subjects.value.push(created)
  }

  async function deleteSubjectById(id: UUID) {
    await service.delete(id)
    const index = subjects.value.findIndex((s) => s.id === id)
    subjects.value.splice(index, 1)
  }

  async function updateSubject(_subject: ISubjectSchedules) {
    const result = await service.update(_subject.id, _subject)
    const index = subjects.value.findIndex((s) => s.id === _subject.id)
    subjects.value[index] = result
  }

  async function fetchSubjects() {
    const data = await service.getAll()
    subjects.value = data.filter(
      (subject: IBaseSubjectSchedules) => subject?.schedules?.length > 0,
    )
  }

  return {
    mySubjects: subjects,
    updateSubject,
    saveNewSubject,
    deleteSubjectById,
    fetchSubjects,
  }
}
