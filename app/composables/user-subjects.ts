import type {
  IBaseSubjectSchedules,
  ISubjectSchedule,
  ISubjectSchedules,
  ISubject,
} from '~/interfaces/subject'
import type { SubjectScheduleId } from '~~/shared/domain'
import type { ISubject as ISubjectDomain } from '~~/shared/domain/types/subject'
import { DEFAULT_SUBJECT_COLOR } from '~/constants/event'
import { useSubjectApi } from '~~/modules/apis/runtime/composables'

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
    color: _subject.color ?? DEFAULT_SUBJECT_COLOR,
  }
}

function toSubjectDomain(subject: ISubject): Omit<ISubjectDomain, 'id'> {
  return {
    course: subject.course,
    type: subject.type,
    studyPlan: {
      id: subject.studyPlan.id,
      fromDate: subject.studyPlan.fromDate,
      code: subject.studyPlan.code,
      createdAt: subject.studyPlan.createdAt,
      updatedAt: subject.studyPlan.updatedAt,
      organizationUnit: subject.studyPlan.organizationUnit,
    },
    credits: subject.credits,
    cycle: subject.cycle,
    createdAt: subject.createdAt,
    updatedAt: subject.updatedAt,
  }
}

function toUpdateDomnain(
  _subject: Pick<ISubjectSchedules, 'id'> &
    Partial<Pick<ISubjectSchedules, 'subject' | 'schedules' | 'color'>>,
): import('~~/shared/domain').IUserSubjectUpdate {
  const { subject, schedules, color } = _subject

  return {
    ...(subject ? { subject: toSubjectDomain(subject) } : {}),
    ...(schedules ? { schedules: toScheduleDomain(schedules) } : {}),
    ...(typeof color !== 'undefined' ? { color } : {}),
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
    _subject: Pick<ISubjectSchedules, 'id'> &
      Partial<Pick<ISubjectSchedules, 'subject' | 'schedules' | 'color'>>,
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
