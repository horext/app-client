import type { UUID } from 'crypto'
import { storeToRefs } from 'pinia'
import type { IActivity, IBaseActivity } from '~/interfaces/event'

export const useUserEvents = () => {
  const store = useUserEventsStore()
  const service = useActivitiesService()
  const userId = useSchedulesUserId()
  const { items } = storeToRefs(store)

  async function createNewItem(item: IBaseActivity) {
    const result = await service.create(userId, item)
    items.value.push(result)
  }

  async function deleteItemById(id: UUID) {
    await service.delete(userId, id)
    store.deleteItemById(id)
  }

  async function updateItem(item: IBaseActivity & { id?: IActivity['id'] }) {
    const itemId = item.id
    if (!itemId) return
    const result = await service.updateById(userId, itemId, { ...item })
    store.updateItem(result)
  }

  async function fetchItems() {
    if (!service) return
    const data = await service.getAll(userId)
    store.setItems(data)
  }

  return {
    items,
    createNewItem,
    deleteItemById,
    updateItem,
    fetchItems,
  }
}
