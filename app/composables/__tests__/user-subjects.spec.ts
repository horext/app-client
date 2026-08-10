import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import type { ISubjectSchedules } from '~/interfaces/subject'
import type { UUID } from 'crypto'
import { useUserSubjectsStore } from '~/stores/user-subjects'

import { useUserSubjects } from '../user-subjects'

const mockCreate = vi.fn()
const mockDelete = vi.fn()
const mockPatch = vi.fn()
const mockGetAll = vi.fn()

mockNuxtImport('useSubjectsService', () =>
  vi.fn(() => ({
    create: mockCreate,
    delete: mockDelete,
    patch: mockPatch,
    getAll: mockGetAll,
  })),
)

function makeSubject(id: UUID = crypto.randomUUID()): ISubjectSchedules {
  return {
    id,
    schedules: [{ id: 1 } as never],
    subject: { id: 1, course: { id: 'CS101', name: 'CS' } } as never,
    sections: [],
  } as ISubjectSchedules
}

const asEntity = (subject: ISubjectSchedules) => ({
  toSnapshot: () => subject,
})

describe('useUserSubjects', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
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
    mockCreate.mockResolvedValue(asEntity(newSubject))
    const { saveNewSubject, mySubjects } = useUserSubjects()
    await saveNewSubject(newSubject)
    expect(mockCreate).toHaveBeenCalledWith(expect.any(String), newSubject)
    expect(mySubjects.value).toContainEqual(newSubject)
  })

  it('deleteSubjectById deletes from service and removes from store', async () => {
    const subject = makeSubject()
    const store = useUserSubjectsStore()
    store.subjects = [subject]
    mockDelete.mockResolvedValue(undefined)
    const { deleteSubjectById, mySubjects } = useUserSubjects()
    await deleteSubjectById(subject.id as UUID)
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
      sections: [{ id: 'A' }],
    } as ISubjectSchedules
    const store = useUserSubjectsStore()
    store.subjects = [original]
    mockPatch.mockResolvedValue(asEntity(updated))
    const { updateSubject, mySubjects } = useUserSubjects()
    await updateSubject(original)
    expect(mockPatch).toHaveBeenCalled()
    expect(mySubjects.value[0]).toEqual(updated)
  })

  it('fetchSubjects loads subjects filtering those with schedules', async () => {
    const withSchedules = makeSubject()
    const withoutSchedules = {
      ...makeSubject(),
      schedules: [],
    } as ISubjectSchedules
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
