import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { v4 } from 'uuid'
import { ref } from 'vue'
import Event from '~/model/Event'

export const useUserEventsStore = defineStore('user/events', () => {
  const storageEvent = useLocalStorage<any[]>('myEvents', [], {
    initOnMounted: true,
    writeDefaults: false,
  })
  const items = ref<Event[]>([])

  function setItems(newItems: Event[]) {
    items.value = newItems
  }

  function addItem(item: Event) {
    items.value.push(
      Object.assign(new Event(0, '', '', '', '', '', '', '', ''), item),
    )
  }

  function deleteItemByIndex(index: number) {
    items.value.splice(index, 1)
  }

  function updateItemByIndex({ index, item }: { index: number; item: any }) {
    items.value = items.value.map((c, i) => (i === index ? item : c))
  }

  function saveNewItem(item: Event) {
    addItem(item)
    storageEvent.value = items.value
  }

  function deleteItemById(id: string) {
    const index = items.value.findIndex((s) => s.id === id)
    deleteItemByIndex(index)
    storageEvent.value = items.value
  }

  function updateItem(item: Event) {
    const index = items.value.findIndex((s) => s.id === item.id)
    if (index >= 0) {
      updateItemByIndex({
        index,
        item,
      })
      storageEvent.value = items.value
    } else {
      console.error(index)
    }
  }

  function updateItems(items: any[]) {
    setItems(items)
    storageEvent.value = items
  }

  const fetchItems = () => {
    const myEvents = storageEvent.value
    const events = myEvents.map((e: { id: any }) =>
      Object.assign(new Event(0, '', '', '', '', '', '', '', ''), e, {
        id: e?.id || v4(),
        type: 'MY_EVENT',
      }),
    )
    setItems(events)
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
