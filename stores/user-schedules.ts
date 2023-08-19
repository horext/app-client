import { ref } from 'vue'
import { defineStore } from 'pinia'
import { $storage } from '~/utils/api'

export const userUserSchedulesStore = defineStore('user/schedules', () => {
  const items = ref<any[]>([])

  const setItems = (newItems: any) => {
    items.value = newItems
  }

  const addItem = (item: any) => {
    items.value.push(Object.assign({}, item))
  }

  const deleteItemByIndex = (index: any) => {
    items.value.splice(index, 1)
  }

  const updateItemByIndex = ({ index, item }: { item: any; index: number }) => {
    items.value = items.value.map((c: any, i: any) => (i === index ? item : c))
  }

  const saveNewItem = (item: any) => {
    addItem(item)
    $storage.setLocalStorage('mySchedules', items.value)
  }

  const deleteItemById = (id: any) => {
    const index = items.value.findIndex((s: { id: any }) => s.id === id)
    deleteItemByIndex(index)
    $storage.setLocalStorage('mySchedules', items.value)
  }

  const updateItem = (item: { id: any }) => {
    const index = items.value.findIndex((s: { id: any }) => s.id === item.id)
    updateItemByIndex({ index, item })
    $storage.setLocalStorage('mySchedules', items.value)
  }

  const updateItems = (newItems: any) => {
    setItems(newItems)
    $storage.setLocalStorage('mySchedules', items.value)
  }

  const fetchItems = () => {
    const fetchedItems = $storage.getLocalStorage('mySchedules') || []
    setItems(fetchedItems)
    return fetchedItems
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
