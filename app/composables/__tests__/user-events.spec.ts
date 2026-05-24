import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import type { IActivity } from '~/interfaces/event'
import type { UUID } from 'crypto'
import { useUserEventsStore } from '~/stores/user-events'

import { useUserEvents } from '../user-events'
import { Activity } from '~/models/Event'

const mockCreate = vi.fn()
const mockDelete = vi.fn()
const mockUpdateById = vi.fn()
const mockGetAll = vi.fn()

mockNuxtImport('useActivitiesService', () =>
  vi.fn(() => ({
    create: mockCreate,
    delete: mockDelete,
    updateById: mockUpdateById,
    getAll: mockGetAll,
  })),
)

function makeActivity(): Activity {
  return Activity.buildActivityFrom({
    day: 1,
    startTime: '08:00',
    endTime: '10:00',
    color: '#1976d2',
    id: crypto.randomUUID(),
    title: 'Test Activity',
  })
}

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
    mockCreate.mockResolvedValue(activity)
    const { createNewItem, items } = useUserEvents()
    await createNewItem(activity)
    expect(mockCreate).toHaveBeenCalledWith(activity)
    expect(items.value).toContainEqual(activity)
  })

  it('deleteItemById calls service.delete and removes item from store', async () => {
    const id = crypto.randomUUID() as UUID
    const store = useUserEventsStore()
    store.items = [{ id } as IActivity]
    mockDelete.mockResolvedValue(undefined)
    const { deleteItemById, items } = useUserEvents()
    await deleteItemById(id)
    expect(mockDelete).toHaveBeenCalledWith(id)
    expect(items.value).not.toContainEqual(expect.objectContaining({ id }))
  })

  it('updateItem calls service.updateById and updates item in store', async () => {
    const activity = makeActivity()
    const activityWithId = { ...activity, id: crypto.randomUUID() as UUID }
    const store = useUserEventsStore()
    store.items = [activityWithId as IActivity]
    mockUpdateById.mockResolvedValue(activityWithId)
    const { updateItem, items } = useUserEvents()
    await updateItem(activityWithId as Activity)
    expect(mockUpdateById).toHaveBeenCalled()
    expect(items.value).toContainEqual(activityWithId)
  })

  it('updateItem does nothing when id is falsy', async () => {
    const activityNoId = { ...makeActivity(), id: undefined }
    const { updateItem } = useUserEvents()
    await updateItem(activityNoId as Activity)
    expect(mockUpdateById).not.toHaveBeenCalled()
  })

  it('fetchItems calls service.getAll and updates the store', async () => {
    const items: IActivity[] = []
    mockGetAll.mockResolvedValue(items)
    const { fetchItems, items: storeItems } = useUserEvents()
    await fetchItems()
    expect(mockGetAll).toHaveBeenCalled()
    expect(storeItems.value).toEqual(items)
  })
})
