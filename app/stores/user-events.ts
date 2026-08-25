import type { UUID } from 'crypto'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IActivity } from '~/interfaces/event'

export const useUserEventsStore = defineStore('user/events', () => {
  const loadingEvents = ref(true)
  const items = ref<Array<IActivity>>([])

  function setItems(newItems: Array<IActivity>) {
    items.value = newItems
  }

  function addItem(item: IActivity) {
    items.value.push(item)
  }

  function updateItem(item: IActivity) {
    const index = items.value.findIndex((e) => e.id === item.id)
    if (index >= 0) {
      items.value[index] = item
    }
  }

  function deleteItemById(id: UUID) {
    items.value = items.value.filter((e) => e.id !== id)
  }

  function clearItems() {
    items.value = []
  }

  return {
    loadingEvents,
    items,
    setItems,
    addItem,
    updateItem,
    deleteItemById,
    clearItems,
  }
})
