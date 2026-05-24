import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import type { ISubjectSchedules } from '~/interfaces/subject'
import type { UUID } from 'crypto'

import { useUserSubjects } from '../user-subjects'

const mockSubjects = ref<ISubjectSchedules[]>([])

const mockCreate = vi.fn()
const mockDelete = vi.fn()
const mockUpdate = vi.fn()
const mockGetAll = vi.fn()

mockNuxtImport('useUserSubjectsStore', () =>
  vi.fn(() => ({
    subjects: mockSubjects,
  })),
)

mockNuxtImport('useSubjectsService', () =>
  vi.fn(() => ({
    create: mockCreate,
    delete: mockDelete,
    update: mockUpdate,
    getAll: mockGetAll,
  })),
)

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  return {
    ...actual,
    storeToRefs: vi.fn((store) => store),
  }
})

function makeSubject(id: UUID = crypto.randomUUID()): ISubjectSchedules {
  return {
    id,
    schedules: [{ id: 1 } as never],
    subject: { id: 1, course: { id: 'CS101', name: 'CS' } } as never,
    sections: [],
  } as ISubjectSchedules
}

describe('useUserSubjects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSubjects.value = []
  })

  it('returns mySubjects, updateSubject, saveNewSubject, deleteSubjectById, fetchSubjects', () => {
    const result = useUserSubjects()
    expect(result.mySubjects).toBeDefined()
    expect(result.saveNewSubject).toBeTypeOf('function')
    expect(result.deleteSubjectById).toBeTypeOf('function')
    expect(result.updateSubject).toBeTypeOf('function')
    expect(result.fetchSubjects).toBeTypeOf('function')
  })

  it('saveNewSubject creates a subject and pushes to store', async () => {
    const newSubject = makeSubject()
    mockCreate.mockResolvedValue(newSubject)
    const { saveNewSubject } = useUserSubjects()
    await saveNewSubject(newSubject)
    expect(mockCreate).toHaveBeenCalledWith(newSubject)
    expect(mockSubjects.value).toContainEqual(newSubject)
  })

  it('deleteSubjectById deletes from service and removes from store', async () => {
    const subject = makeSubject()
    mockSubjects.value = [subject]
    mockDelete.mockResolvedValue(undefined)
    const { deleteSubjectById } = useUserSubjects()
    await deleteSubjectById(subject.id as UUID)
    expect(mockDelete).toHaveBeenCalledWith(subject.id)
    expect(mockSubjects.value).not.toContain(subject)
  })

  it('updateSubject updates in service and replaces in store', async () => {
    const original = makeSubject()
    const updated = {
      ...original,
      sections: [{ id: 'A' }],
    } as ISubjectSchedules
    mockSubjects.value = [original]
    mockUpdate.mockResolvedValue(updated)
    const { updateSubject } = useUserSubjects()
    await updateSubject(original)
    expect(mockUpdate).toHaveBeenCalled()
    expect(mockSubjects.value[0]).toEqual(updated)
  })

  it('fetchSubjects loads subjects filtering those with schedules', async () => {
    const withSchedules = makeSubject()
    const withoutSchedules = {
      ...makeSubject(),
      schedules: [],
    } as ISubjectSchedules
    mockGetAll.mockResolvedValue([withSchedules, withoutSchedules])
    const { fetchSubjects } = useUserSubjects()
    await fetchSubjects()
    expect(mockSubjects.value).toContainEqual(withSchedules)
    expect(mockSubjects.value).not.toContainEqual(withoutSchedules)
  })
})
