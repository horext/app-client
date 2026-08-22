import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import type { IActivity } from '~/interfaces/event'
import type { UUID } from 'crypto'
import { useUserEventsStore } from '~/stores/user-events'

import { useUserEvents } from '../user-events'
import { DEFAULT_ACTIVITY_COLOR } from '~/constants/event'
import { Activity, type ActivityID } from '~~/shared/domain'

const mockCreate = vi.fn()
const mockDelete = vi.fn()
const mockPatch = vi.fn()
const mockGetAll = vi.fn()

mockNuxtImport('useActivitiesService', () =>
  vi.fn(() => ({
    create: mockCreate,
    delete: mockDelete,
    patch: mockPatch,
    getAll: mockGetAll,
  })),
)

function makeActivity(): IActivity {
  return {
    sessions: [{ day: 1, startTime: '08:00', endTime: '10:00' }],
    color: DEFAULT_ACTIVITY_COLOR,
    id: crypto.randomUUID(),
    title: 'Test Activity',
  }
}

const asEntity = (activity: IActivity) =>
  Activity.reconstitute({
    ...activity,
    id: activity.id as ActivityID,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdBy: 'user-1',
    updatedBy: 'user-1',
  })

describe('useUserEvents', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('returns items, createNewItem, deleteItemById, updateItem, fetchItems', () => {
    const result = useUserEvents()
    expect(result.items).toBeDefined()
    expect(result.createNewItem).toBeTypeOf('function')
    expect(result.deleteItemById).toBeTypeOf('function')
    expect(result.updateItem).toBeTypeOf('function')
    expect(result.fetchItems).toBeTypeOf('function')
  })

  it('createNewItem calls service.create and pushes result to store', async () => {
    const activity = makeActivity()
    mockCreate.mockResolvedValue(asEntity(activity))
    const { createNewItem, items } = useUserEvents()
    await createNewItem(activity)
    expect(mockCreate).toHaveBeenCalledWith(expect.any(String), activity)
    expect(items.value).toContainEqual(expect.objectContaining(activity))
  })

  it('deleteItemById calls service.delete and removes item from store', async () => {
    const id = crypto.randomUUID() as UUID
    const store = useUserEventsStore()
    store.items = [{ id } as IActivity]
    mockDelete.mockResolvedValue(undefined)
    const { deleteItemById, items } = useUserEvents()
    await deleteItemById(id)
    expect(mockDelete).toHaveBeenCalledWith(expect.any(String), id)
    expect(items.value).not.toContainEqual(expect.objectContaining({ id }))
  })

  it('updateItem calls service.patch and updates item in store', async () => {
    const activity = makeActivity()
    const activityWithId = { ...activity, id: crypto.randomUUID() as UUID }
    const store = useUserEventsStore()
    store.items = [activityWithId as IActivity]
    mockPatch.mockResolvedValue(asEntity(activityWithId))
    const { updateItem, items } = useUserEvents()
    await updateItem(activityWithId)
    expect(mockPatch).toHaveBeenCalled()
    expect(items.value).toContainEqual(expect.objectContaining(activityWithId))
  })

  it('updateItem does nothing when id is falsy', async () => {
    const activityNoId = { ...makeActivity(), id: undefined }
    const { updateItem } = useUserEvents()
    await updateItem(activityNoId)
    expect(mockPatch).not.toHaveBeenCalled()
  })

  it('fetchItems calls service.getAll and updates the store', async () => {
    const items: IActivity[] = []
    mockGetAll.mockResolvedValue(items.map(asEntity))
    const { fetchItems, items: storeItems } = useUserEvents()
    await fetchItems()
    expect(mockGetAll).toHaveBeenCalled()
    expect(storeItems.value).toEqual(items)
  })
})
