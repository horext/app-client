import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import type { IActivity } from '~/interfaces/event'
import type { UUID } from 'crypto'

import { useUserEvents } from '../user-events'
import { Activity } from '~/models/Event'

const mockItems = ref<IActivity[]>([])
const mockSetItems = vi.fn((items: IActivity[]) => {
  mockItems.value = items
})
const mockUpdateItem = vi.fn()
const mockDeleteItemById = vi.fn()

const mockCreate = vi.fn()
const mockDelete = vi.fn()
const mockUpdateById = vi.fn()
const mockGetAll = vi.fn()

mockNuxtImport('useUserEventsStore', () =>
  vi.fn(() => ({
    items: mockItems,
    setItems: mockSetItems,
    updateItem: mockUpdateItem,
    deleteItemById: mockDeleteItemById,
  })),
)

mockNuxtImport('useActivitiesService', () =>
  vi.fn(() => ({
    create: mockCreate,
    delete: mockDelete,
    updateById: mockUpdateById,
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
    vi.clearAllMocks()
    mockItems.value = []
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
    const { createNewItem } = useUserEvents()
    await createNewItem(activity)
    expect(mockCreate).toHaveBeenCalledWith(activity)
    expect(mockItems.value).toContainEqual(activity)
  })

  it('deleteItemById calls service.delete and store.deleteItemById', async () => {
    const id = crypto.randomUUID() as UUID
    mockDelete.mockResolvedValue(undefined)
    const { deleteItemById } = useUserEvents()
    await deleteItemById(id)
    expect(mockDelete).toHaveBeenCalledWith(id)
    expect(mockDeleteItemById).toHaveBeenCalledWith(id)
  })

  it('updateItem calls service.updateById and store.updateItem', async () => {
    const activity = makeActivity()
    const activityWithId = { ...activity, id: crypto.randomUUID() as UUID }
    mockUpdateById.mockResolvedValue(activityWithId)
    const { updateItem } = useUserEvents()
    await updateItem(activityWithId as Activity)
    expect(mockUpdateById).toHaveBeenCalled()
    expect(mockUpdateItem).toHaveBeenCalledWith(activityWithId)
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
    const { fetchItems } = useUserEvents()
    await fetchItems()
    expect(mockGetAll).toHaveBeenCalled()
    expect(mockSetItems).toHaveBeenCalledWith(items)
  })
})
