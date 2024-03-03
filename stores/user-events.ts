import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IEvent } from '~/interfaces/event'

export const useUserEventsStore = defineStore('user/events', () => {
  const storage = useLocalStorage<IEvent[]>()
  const items = ref<IEvent[]>([])

  function setItems(newItems: IEvent[]) {
    items.value = newItems
  }

  function addItem(item: IEvent) {
    items.value.push(item)
  }

  function deleteItemByIndex(index: number) {
    items.value.splice(index, 1)
  }

  function updateItemByIndex({ index, item }: { index: number; item: any }) {
    items.value = items.value.map((c, i) => (i === index ? item : c))
  }

  function saveNewItem(item: IEvent) {
    addItem(item)
    storage.setItem('events', items.value)
  }

  function deleteItemById(id: string) {
    const index = items.value.findIndex((s) => s.id === id)
    deleteItemByIndex(index)
    storage.setItem('myEvents', items.value)
  }

  function updateItem(item: IEvent) {
    const index = items.value.findIndex((s) => s.id === item.id)
    if (index >= 0) {
      updateItemByIndex({
        index,
        item,
      })
      storage.setItem('myEvents', items.value)
    } else {
      console.error(index)
    }
  }

  function updateItems(items: any[]) {
    setItems(items)
    storage.setItem('events', items)
  }

  const fetchItems = async () => {
    const data = (await storage.getItem('myEvents')) || []
    setItems(data)
  }

  return {
    items,
    setItems,
    addItem,
    deleteItemByIndex,
    updateItemByIndex,
    saveNewItem,
    deleteItemById,
    updateItem,
    updateItems,
    fetchItems,
  }
})
