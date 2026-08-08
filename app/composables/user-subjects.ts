import type { UUID } from 'crypto'
import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
} from '~/interfaces/subject'
import { EVENT_COLORS } from '~/constants/event'

export const useUserSubjects = () => {
  const service = useSubjectsService()
  const userId = useSchedulesUserId()
  const store = useUserSubjectsStore()
  const { subjects } = storeToRefs(store)

  async function saveNewSubject(_subject: IBaseSubjectSchedules) {
    const created = await service.create(userId, _subject)
    subjects.value.push(created)
  }

  async function deleteSubjectById(id: UUID) {
    await service.delete(userId, id)
    const index = subjects.value.findIndex((s) => s.id === id)
    if (index >= 0) subjects.value.splice(index, 1)
  }

  async function updateSubject(
    _subject: Pick<ISubjectSchedules, 'id' | 'schedules' | 'color'>,
  ) {
    const result = await service.update(userId, _subject.id, _subject)
    const index = subjects.value.findIndex((s) => s.id === _subject.id)
    subjects.value[index] = result
  }

  async function fetchSubjects() {
    const data = await service.getAll(userId)
    const subjectsWithSchedules = data.filter(
      (subject: IBaseSubjectSchedules) => subject?.schedules?.length > 0,
    )
    subjects.value = subjectsWithSchedules.map((subject, index) => ({
      ...subject,
      color: subject.color ?? EVENT_COLORS[index] ?? '#1976d2',
    }))
  }

  return {
    mySubjects: subjects,
    updateSubject,
    saveNewSubject,
    deleteSubjectById,
    fetchSubjects,
  }
}
