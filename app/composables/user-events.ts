import { storeToRefs } from 'pinia'
import type { Activity } from '~/models/Event'

export const useUserEvents = () => {
  const store = useUserEventsStore()
  const service = useActivitiesService()
  const { items } = storeToRefs(store)

  async function createNewItem(item: Activity) {
    const result = await service.create(item)
    items.value.push(result)
  }

  async function deleteItemById(id: string) {
    await service.delete(id)
    store.deleteItemById(id)
  }

  async function updateItem(item: Activity) {
    const itemId = item.id
    if (!itemId) return
    const result = await service.update({ ...item, id: itemId })
    store.updateItem(result)
  }

  async function fetchItems() {
    if (!service) return
    const data = await service.getAll()
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
