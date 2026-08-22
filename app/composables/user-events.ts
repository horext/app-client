import type { UUID } from 'crypto'
import { storeToRefs } from 'pinia'
import type { ActivityForm, IBaseActivity } from '~/interfaces/event'

export const useUserEvents = () => {
  const store = useUserEventsStore()
  const service = useActivitiesService()
  const userId = useSchedulesUserId()
  const { items } = storeToRefs(store)

  async function createNewItem(item: IBaseActivity) {
    const result = await service.create(userId, {
      ...item,
    })
    store.addItem(result.toSnapshot())
  }

  async function deleteItemById(id: UUID) {
    await service.delete(userId, id)
    store.deleteItemById(id)
  }

  async function updateItem(item: ActivityForm) {
    const itemId = item.id
    if (!itemId) return
    const result = await service.patch(userId, itemId, {
      ...item,
    })
    store.updateItem(result.toSnapshot())
  }

  async function fetchItems() {
    if (!service) return
    const data = await service.getAll(userId)
    store.setItems(data.map((entity) => entity.toSnapshot()))
  }

  return {
    items,
    createNewItem,
    deleteItemById,
    updateItem,
    fetchItems,
  }
}
