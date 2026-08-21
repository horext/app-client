import type {
  IBaseSubjectSchedules,
  ISubjectSchedule,
  ISubjectSchedules,
} from '~/interfaces/subject'
import type { SubjectScheduleId } from '~~/shared/domain'

export function toScheduleDomain(
  schedules: ISubjectSchedule[],
): import('~~/shared/domain').ISubjectSchedule[] {
  return schedules.map((schedule) => ({
    ...schedule,
    sessions: schedule.sessions.map((session) => ({
      ...session,
      classroom: {
        ...session.classroom,
        name: session.classroom?.name ?? undefined,
      },
    })),
  }))
}

function toCreateDomain(
  _subject: IBaseSubjectSchedules,
): import('~~/shared/domain').IBaseSubjectSchedules {
  return {
    ..._subject,
    schedules: toScheduleDomain(_subject.schedules),
    color: _subject.color,
  }
}

function toUpdateDomnain(
  _subject: Pick<ISubjectSchedules, 'id' | 'schedules' | 'color'>,
): import('~~/shared/domain').ISubjectSchedulesUpdate {
  return {
    ..._subject,
    schedules: toScheduleDomain(_subject.schedules),
    color: _subject.color,
  }
}

export const useUserSubjects = () => {
  const service = useSubjectsService()
  const userId = useSchedulesUserId()
  const store = useUserSubjectsStore()
  const { subjects } = storeToRefs(store)

  async function saveNewSubject(_subject: IBaseSubjectSchedules) {
    const created = await service.create(userId, toCreateDomain(_subject))
    subjects.value.push(created.toSnapshot())
  }

  async function deleteSubjectById(id: SubjectScheduleId) {
    await service.delete(userId, id)
    const index = subjects.value.findIndex((s) => s.id === id)
    if (index >= 0) subjects.value.splice(index, 1)
  }

  async function updateSubject(
    _subject: Pick<ISubjectSchedules, 'id' | 'schedules' | 'color'>,
  ) {
    const result = await service.patch(
      userId,
      _subject.id,
      toUpdateDomnain(_subject),
    )
    const index = subjects.value.findIndex((s) => s.id === _subject.id)
    subjects.value[index] = result.toSnapshot()
  }

  async function updateSubjectColor(id: SubjectScheduleId, color: string) {
    const result = await service.patch(userId, id, {
      color,
    })
    const index = subjects.value.findIndex((subject) => subject.id === id)
    if (index >= 0) subjects.value[index] = result.toSnapshot()
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
    saveNewSubject,
    deleteSubjectById,
    fetchSubjects,
  }
}
