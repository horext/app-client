import { defineStore } from 'pinia'
import { v4 } from 'uuid'
import { ref } from 'vue'
import { $storage } from '~/utils/api'
import Event from '~/model/Event'

export const useUserEventsStore = defineStore('user/events', () => {
  const items = ref<any[]>([])

  function setItems (newItems: any[]) {
    items.value = newItems
  }

  function addItem (item: any) {
    items.value.push(
      Object.assign(new Event(0, '', '', '', '', '', '', '', ''), item)
    )
  }

  function deleteItemByIndex (index: number) {
    items.value.splice(index, 1)
  }

  function updateItemByIndex ({ index, item }: { index: number; item: any }) {
    items.value = items.value.map((c, i) => (i === index ? item : c))
  }

  function saveNewItem (item: any) {
    addItem(item)
    $storage.setLocalStorage('myEvents', items.value)
  }

  function deleteItemById (id: any) {
    const index = items.value.findIndex(s => s.id === id)
    deleteItemByIndex(index)
    $storage.setLocalStorage('myEvents', items.value)
  }

  function updateItem (item: { id: any }) {
    const index = items.value.findIndex(s => s.id === item.id)
    if (index >= 0) {
      updateItemByIndex({
        index,
        item
      })
      $storage.setLocalStorage('myEvents', items.value)
    } else {
      console.error(index)
    }
  }

  function updateItems (items: any[]) {
    setItems(items)
    $storage.setLocalStorage('myEvents', items)
  }

  const fetchItems = () => {
    const myEvents = $storage.getLocalStorage('myEvents') || []
    const events = myEvents.map((e: { id: any }) =>
      Object.assign(new Event(0, '', '', '', '', '', '', '', ''), e, {
        id: e?.id || v4(),
        type: 'MY_EVENT'
      })
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
    fetchItems
  }
})
