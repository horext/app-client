import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IEvent } from '~/interfaces/event'

export const useUserEventsStore = defineStore('user/events', () => {
  const service = useActivitiesService()
  const items = ref<Array<IEvent & { id: string }>>([])

  function setItems(newItems: Array<IEvent & { id: string }>) {
    items.value = newItems
  }

  function saveNewItem(item: IEvent & { id: string }) {
    items.value.push(item)
    return service.save(item)
  }

  function deleteItemById(id: string) {
    items.value = items.value.filter((e) => e.id !== id)
    return service.delete(id)
  }

  function updateItem(item: IEvent & { id: string }) {
    const index = items.value.findIndex((e) => e.id === item.id)
    if (index >= 0) {
      items.value = items.value.map((e, i) => (i === index ? item : e))
      return service.update(item)
    } else {
      console.error('updateItem: item not found', item.id)
      return Promise.resolve()
    }
  }

  async function updateItems(newItems: Array<IEvent & { id: string }>) {
    setItems(newItems)
    await service.saveAll(newItems)
  }

  async function fetchItems() {
    const data = await service.getAll()
    setItems(data)
  }

  return {
    items,
    setItems,
    saveNewItem,
    deleteItemById,
    updateItem,
    updateItems,
    fetchItems,
  }
})
