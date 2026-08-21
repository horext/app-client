import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
} from '~/interfaces/subject'
import type { SubjectScheduleId } from '~~/shared/domain'
import { DEFAULT_SUBJECT_COLOR } from '~/constants/event'
import { useSubjectApi } from '~~/modules/apis/runtime/composables'
import {
  toDomainSubjectSchedules,
  toDomainSubjectUpdate,
} from '~/mappers/subject/domain'

export const useUserSubjects = () => {
  const service = useSubjectsService()
  const userId = useSchedulesUserId()
  const store = useUserSubjectsStore()
  const { subjects } = storeToRefs(store)

  async function saveNewSubject(_subject: IBaseSubjectSchedules) {
    const created = await service.create(userId, {
      ...toDomainSubjectSchedules(_subject),
      color: _subject.color ?? DEFAULT_SUBJECT_COLOR,
    })
    subjects.value.push(created.toSnapshot())
  }

  async function deleteSubjectById(id: SubjectScheduleId) {
    await service.delete(userId, id)
    const index = subjects.value.findIndex((s) => s.id === id)
    if (index >= 0) subjects.value.splice(index, 1)
  }

  async function updateSubject(
    _subject: Pick<ISubjectSchedules, 'id'> &
      Partial<Pick<ISubjectSchedules, 'subject' | 'schedules' | 'color'>>,
  ) {
    const result = await service.patch(
      userId,
      _subject.id,
      toDomainSubjectUpdate(_subject),
    )
    const index = subjects.value.findIndex((s) => s.id === _subject.id)
    subjects.value[index] = result.toSnapshot()
  }

  async function updateSubjectColor(id: SubjectScheduleId, color: string) {
    const result = await service.patch(userId, id, { color })
    const index = subjects.value.findIndex((subject) => subject.id === id)
    if (index >= 0) subjects.value[index] = result.toSnapshot()
  }

  const subjectApi = useSubjectApi()

  async function refreshSubjectCatalog() {
    if (subjects.value.length === 0) return

    const latestSubjects = await subjectApi.findAllByIds(
      subjects.value.map(({ subject }) => subject.id),
    )
    const latestById = new Map(
      latestSubjects.map((subject) => [subject.id, subject]),
    )

    await Promise.all(
      subjects.value.map(async (saved) => {
        const latest = latestById.get(saved.subject.id)
        if (!latest) return

        if (latest.updatedAt === saved.subject.updatedAt) return

        await updateSubject({ id: saved.id, subject: latest })
      }),
    )
  }

  async function fetchSubjects() {
    const data = await service.getAll(userId)
    const subjectsWithSchedules = data
      .map((entity) => entity.toSnapshot())
      .filter(
        (subject: IBaseSubjectSchedules) => subject?.schedules?.length > 0,
      )
    subjects.value = subjectsWithSchedules
  }

  return {
    mySubjects: subjects,
    updateSubject,
    updateSubjectColor,
    refreshSubjectCatalog,
    saveNewSubject,
    deleteSubjectById,
    fetchSubjects,
  }
}
