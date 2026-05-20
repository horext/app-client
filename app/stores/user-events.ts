import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IEvent } from '~/interfaces/event'

export const useUserEventsStore = defineStore('user/events', () => {
  const items = ref<Array<IEvent & { id: string }>>([])

  function setItems(newItems: Array<IEvent & { id: string }>) {
    items.value = newItems
  }

  return {
    items,
    setItems,
  }
})
