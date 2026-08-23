import type {
  IBasePlannedSubject,
  IPlannedSubjectUpdate,
} from '~/interfaces/subject'
import type { PlannedSubjectId } from '~~/shared/domain'
import { DEFAULT_SUBJECT_COLOR } from '~/constants/event'
import { useSubjectApi } from '~~/modules/apis/runtime/composables'
import {
  toDomainPlannedSubject,
  toDomainSubjectUpdate,
} from '~/mappers/subject/domain'
import { toPlannedSubjectDto } from '~/mappers/domain/entities'

export const useUserSubjects = () => {
  const service = useSubjectsService()
  const userId = useSchedulesUserId()
  const store = useUserSubjectsStore()
  const { subjects, hasSubjects } = storeToRefs(store)

  async function saveNewSubject(_subject: IBasePlannedSubject) {
    const created = await service.create(userId, {
      ...toDomainPlannedSubject(_subject),
      color: _subject.color ?? DEFAULT_SUBJECT_COLOR,
    })
    store.addSubject(toPlannedSubjectDto(created))
  }

  async function deleteSubjectById(id: PlannedSubjectId) {
    await service.delete(userId, id)
    store.deleteSubjectById(id)
  }

  async function updateSubject(_subject: IPlannedSubjectUpdate) {
    const result = await service.patch(
      userId,
      _subject.id,
      toDomainSubjectUpdate(_subject),
    )
    store.updateSubject(toPlannedSubjectDto(result))
  }

  async function updateSubjectColor(id: PlannedSubjectId, color: string) {
    const result = await service.patch(userId, id, { color })
    store.updateSubject(toPlannedSubjectDto(result))
  }

  const subjectApi = useSubjectApi()

  async function refreshSubjectCatalog() {
    if (!hasSubjects.value) return

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
      .map(toPlannedSubjectDto)
      .filter((subject: IBasePlannedSubject) => subject?.schedules?.length > 0)
    store.setSubjects(subjectsWithSchedules)
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
