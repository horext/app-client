import { storeToRefs } from 'pinia'
import type { IEvent } from '~/interfaces/event'

export const useUserEvents = () => {
  const store = useUserEventsStore()
  const service = useActivitiesService()
  const { items } = storeToRefs(store)

  function saveNewItem(item: IEvent & { id: string }) {
    items.value.push(item)
    return service.save(item) ?? Promise.resolve()
  }

  function deleteItemById(id: string) {
    items.value = items.value.filter((e) => e.id !== id)
    return service.delete(id) ?? Promise.resolve()
  }

  function updateItem(item: IEvent & { id: string }) {
    const index = items.value.findIndex((e) => e.id === item.id)
    if (index >= 0) {
      items.value = items.value.map((e, i) => (i === index ? item : e))
      return service.update(item) ?? Promise.resolve()
    } else {
      console.error('updateItem: item not found', item.id)
      return Promise.resolve()
    }
  }

  async function updateItems(newItems: Array<IEvent & { id: string }>) {
    store.setItems(newItems)
    await service.saveAll(newItems)
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
    updateItems,
    fetchItems,
  }
}
