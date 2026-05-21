import { storeToRefs } from 'pinia'
import type { IEvent } from '~/interfaces/event'

export const useUserEvents = () => {
  const store = useUserEventsStore()
  const service = useActivitiesService()
  const { items } = storeToRefs(store)

  async function saveNewItem(item: IEvent) {
    const result = await service.create(item)
    items.value.push(result)
  }

  async function deleteItemById(id: string) {
    await service.delete(id)
    items.value = items.value.filter((e) => e.id !== id)
  }

  async function updateItem(item: IEvent) {
    const itemId = item.id
    if (!itemId) return
    const result = await service.update({ ...item, id: itemId })
    const index = items.value.findIndex((e) => e.id === itemId)
    if (index !== -1) {
      items.value[index] = result
    }
  }

  async function fetchItems() {
    if (!service) return
    const data = await service.getAll()
    store.setItems(data)
  }

  return {
    items,
    saveNewItem,
    deleteItemById,
    updateItem,
    fetchItems,
  }
}
