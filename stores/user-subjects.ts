import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'
import { $storage } from '~/utils/api'

export const useUserSubjects = defineStore('user/subjects', () => {
  const items = ref<any[]>([])

  function setItems (newItems: any) {
    items.value = newItems
  }

  function addItem (newItem: any) {
    items.value.push({ ...newItem, id: uuidv4() })
  }

  function deleteItemByIndex (index: number) {
    items.value.splice(index, 1)
  }

  function updateItemByIndex ({ index, item }: { index: number; item: any }) {
    items.value = items.value.map((c, i) => (i === index ? item : c))
  }

  function saveNewItem (item: any) {
    addItem(item)
    $storage.setLocalStorage('mySubjects', items.value)
  }

  function deleteItemById (id: number) {
    const index = items.value.findIndex(s => s.id === id)
    deleteItemByIndex(index)
    $storage.setLocalStorage('mySubjects', items.value)
  }

  function updateItem (item: any) {
    const index = items.value.findIndex(s => s.id === item.id)
    updateItemByIndex({ index, item })
    $storage.setLocalStorage('mySubjects', items.value)
  }

  function updateItems (items: any) {
    setItems(items)
    $storage.setLocalStorage('mySubjects', items)
  }

  function fetchItems () {
    setItems($storage.getLocalStorage('mySubjects') || [])
  }

  return {
    items,
    setItems,
    addItem,
    deleteItemById,
    updateItem,
    updateItems,
    fetchItems,
    saveNewItem,
    deleteItemByIndex,
    updateItemByIndex
  }
})
