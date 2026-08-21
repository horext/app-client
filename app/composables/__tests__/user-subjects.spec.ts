import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import { isProxy, reactive } from 'vue'
import type { ISubjectSchedules } from '~/interfaces/subject'
import type { SubjectScheduleId } from '~~/shared/domain'
import { makeUUID } from '~~/shared/domain/types/ids'
import { useUserSubjectsStore } from '~/stores/user-subjects'

import { useUserSubjects } from '../user-subjects'
import { DEFAULT_SUBJECT_COLOR } from '~/constants/event'
import { UserSubject } from '~~/shared/domain'

const mockCreate = vi.fn()
const mockDelete = vi.fn()
const mockPatch = vi.fn()
const mockGetAll = vi.fn()
const { mockFindAllByIds } = vi.hoisted(() => ({
  mockFindAllByIds: vi.fn(),
}))

mockNuxtImport('useSubjectsService', () =>
  vi.fn(() => ({
    create: mockCreate,
    delete: mockDelete,
    patch: mockPatch,
    getAll: mockGetAll,
  })),
)

vi.mock('~~/modules/apis/runtime/composables', () => ({
  useSubjectApi: () => ({
    findAllByIds: mockFindAllByIds,
  }),
}))

function makeSubject(id: SubjectScheduleId = makeUUID()): ISubjectSchedules {
  return {
    id,
    schedules: [
      {
        id: 1,
        section: {
          id: '',
        },
        scheduleSubject: {
          id: 0,
        },
        sessions: [],
      },
    ],
    color: '#3F51B5',
    subject: {
      id: 1,
      course: { id: 'CS101', name: 'CS' },
      type: {
        id: 0,
        name: '',
        code: '',
      },
      studyPlan: {
        id: 0,
        fromDate: '',
        code: '',
        organizationUnit: {
          id: 0,
        },
      },
      credits: 0,
      cycle: null,
    },
  }
}

const asEntity = (subject: ISubjectSchedules) => ({
  toSnapshot: () => subject,
})

describe('useUserSubjects', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('returns subject management methods', () => {
    const result = useUserSubjects()
    expect(result.mySubjects).toBeDefined()
    expect(result.saveNewSubject).toBeTypeOf('function')
    expect(result.deleteSubjectById).toBeTypeOf('function')
    expect(result.updateSubject).toBeTypeOf('function')
    expect(result.refreshSubjectCatalog).toBeTypeOf('function')
    expect(result.updateSubjectColor).toBeTypeOf('function')
    expect(result.fetchSubjects).toBeTypeOf('function')
  })

  it('saveNewSubject creates a subject and pushes to store', async () => {
    const { id: _id, ...newSubject } = makeSubject()
    const savedSubject = makeSubject()
    mockCreate.mockResolvedValue(asEntity(savedSubject))
    const { saveNewSubject, mySubjects } = useUserSubjects()
    await saveNewSubject(newSubject)
    expect(mockCreate).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        subject: expect.objectContaining({ id: newSubject.subject.id }),
        schedules: expect.any(Array),
        color: newSubject.color,
      }),
    )
    expect(mockCreate.mock.calls[0]?.[1]).not.toHaveProperty('id')
    expect(mySubjects.value).toContainEqual(savedSubject)
  })

  it('passes deeply reactive create data safely through a domain entity', async () => {
    const { id: _id, ...newSubject } = makeSubject()
    const reactiveSubject = reactive(newSubject)
    mockCreate.mockImplementation(async (_userId, input) => {
      expect(isProxy(input)).toBe(false)
      expect(isProxy(input.subject)).toBe(false)
      expect(() => structuredClone(input)).not.toThrow()
      return UserSubject.create(input)
    })

    const { saveNewSubject } = useUserSubjects()
    await expect(saveNewSubject(reactiveSubject)).resolves.toBeUndefined()
  })

  it('saveNewSubject never sends an undefined color', async () => {
    const newSubject = makeSubject()
    const { color: _color, ...subjectWithoutColor } = newSubject
    mockCreate.mockResolvedValue(asEntity(newSubject))
    const { saveNewSubject } = useUserSubjects()

    await saveNewSubject(subjectWithoutColor as unknown as ISubjectSchedules)

    expect(mockCreate).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ color: DEFAULT_SUBJECT_COLOR }),
    )
  })

  it('deleteSubjectById deletes from service and removes from store', async () => {
    const subject = makeSubject()
    const store = useUserSubjectsStore()
    store.subjects = [subject]
    mockDelete.mockResolvedValue(undefined)
    const { deleteSubjectById, mySubjects } = useUserSubjects()
    await deleteSubjectById(subject.id)
    expect(mockDelete).toHaveBeenCalledWith(expect.any(String), subject.id)
    expect(mySubjects.value).not.toContain(subject)
  })

  it('does not remove another subject when the id is missing from the store', async () => {
    const first = makeSubject()
    const missingId = makeSubject()
    const store = useUserSubjectsStore()
    store.subjects = [first]
    mockDelete.mockResolvedValue(undefined)

    const { deleteSubjectById } = useUserSubjects()
    await deleteSubjectById(missingId.id)

    expect(store.subjects).toEqual([first])
  })

  it('updateSubject updates in service and replaces in store', async () => {
    const original = makeSubject()
    const updated = {
      ...original,
    } satisfies ISubjectSchedules
    const store = useUserSubjectsStore()
    store.subjects = [original]
    mockPatch.mockResolvedValue(asEntity(updated))
    const { updateSubject, mySubjects } = useUserSubjects()
    await updateSubject(original)
    expect(mockPatch).toHaveBeenCalled()
    expect(mySubjects.value[0]).toEqual(updated)
  })

  it('updateSubject supports a partial catalog update', async () => {
    const original = makeSubject()
    const updated = {
      ...original,
      subject: { ...original.subject, credits: 5 },
    }
    const store = useUserSubjectsStore()
    store.subjects = [original]
    mockPatch.mockResolvedValue(asEntity(updated))
    const { updateSubject, mySubjects } = useUserSubjects()

    await updateSubject({ id: original.id, subject: updated.subject })

    expect(mockPatch).toHaveBeenCalledWith(
      expect.any(String),
      original.id,
      expect.objectContaining({
        subject: expect.objectContaining({ credits: 5 }),
      }),
    )
    expect(mySubjects.value[0]?.subject.credits).toBe(5)
  })

  it('refreshSubjectCatalog updates changed subjects by catalog id', async () => {
    const original = makeSubject()
    original.subject.updatedAt = '2026-08-20T00:00:00.000Z'
    const latest = {
      ...original.subject,
      credits: 5,
      updatedAt: '2026-08-21T00:00:00.000Z',
    }
    const store = useUserSubjectsStore()
    store.subjects = [original]
    mockFindAllByIds.mockResolvedValue([latest])
    mockPatch.mockResolvedValue(asEntity({ ...original, subject: latest }))
    const { refreshSubjectCatalog, mySubjects } = useUserSubjects()

    await refreshSubjectCatalog()

    expect(mockFindAllByIds).toHaveBeenCalledWith([original.subject.id])
    expect(mockPatch).toHaveBeenCalledWith(
      expect.any(String),
      original.id,
      expect.objectContaining({
        subject: expect.objectContaining({ credits: 5 }),
      }),
    )
    expect(mySubjects.value[0]?.subject.credits).toBe(5)
  })

  it('refreshes legacy records without a subject version', async () => {
    const original = makeSubject()
    original.subject.studyPlan.updatedAt = '2026-08-21T00:00:00.000Z'
    const latest = {
      ...original.subject,
      updatedAt: '2026-08-21T00:00:00.000Z',
    }
    useUserSubjectsStore().subjects = [original]
    mockFindAllByIds.mockResolvedValue([latest])
    mockPatch.mockResolvedValue(asEntity({ ...original, subject: latest }))
    const { refreshSubjectCatalog } = useUserSubjects()

    await refreshSubjectCatalog()

    expect(mockPatch).toHaveBeenCalled()
  })

  it('trusts the subject version when updatedAt is unchanged', async () => {
    const original = makeSubject()
    original.subject.updatedAt = '2026-08-21T00:00:00.000Z'
    const latest = {
      ...original.subject,
      credits: original.subject.credits + 1,
    }
    useUserSubjectsStore().subjects = [original]
    mockFindAllByIds.mockResolvedValue([latest])
    const { refreshSubjectCatalog } = useUserSubjects()

    await refreshSubjectCatalog()

    expect(mockPatch).not.toHaveBeenCalled()
  })

  it('updateSubjectColor patches only the color and updates the store', async () => {
    const original = makeSubject()
    const updated = { ...original, color: '#ff0000' }
    const store = useUserSubjectsStore()
    store.subjects = [original]
    mockPatch.mockResolvedValue(asEntity(updated))
    const { updateSubjectColor, mySubjects } = useUserSubjects()

    await updateSubjectColor(original.id, updated.color)

    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), original.id, {
      color: updated.color,
    })
    expect(mySubjects.value[0]).toEqual(updated)
  })

  it('fetchSubjects loads subjects filtering those with schedules', async () => {
    const withSchedules = makeSubject()
    const withoutSchedules = {
      ...makeSubject(),
      schedules: [],
    } satisfies ISubjectSchedules
    mockGetAll.mockResolvedValue(
      [withSchedules, withoutSchedules].map(asEntity),
    )
    const { fetchSubjects, mySubjects } = useUserSubjects()
    await fetchSubjects()
    expect(mySubjects.value).toContainEqual(
      expect.objectContaining({
        id: withSchedules.id,
        color: expect.any(String),
      }),
    )
    expect(mySubjects.value).not.toContainEqual(withoutSchedules)
  })
})
