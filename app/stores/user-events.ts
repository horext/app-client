import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IEvent } from '~/interfaces/event'

export interface IEventCreated extends IEvent {
  id: string
}

export const useUserEventsStore = defineStore('user/events', () => {
  const items = ref<Array<IEventCreated>>([])

  function setItems(newItems: Array<IEventCreated>) {
    items.value = newItems
  }

  function updateItem(item: IEventCreated) {
    const index = items.value.findIndex((e) => e.id === item.id)
    if (index >= 0) {
      items.value[index] = item
    }
  }
  return {
    items,
    setItems,
    updateItem,
  }
})
