import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ISubject } from '~/interfaces/subject'
import { $storage } from '~/utils/api'

export const useUserSubjects = defineStore('user/subjects', () => {
  const items = ref<ISubject[]>([])

  function setItems (newItems: ISubject[]) {
    items.value = newItems
  }

  function addItem (newItem: ISubject) {
    items.value.push({ ...newItem })
  }

  function deleteItemByIndex (index: number) {
    items.value.splice(index, 1)
  }

  function updateItemByIndex ({ index, item }: { index: number; item: ISubject }) {
    items.value = items.value.map((c, i) => (i === index ? item : c))
  }

  function saveNewItem (item: ISubject) {
    addItem(item)
    $storage.setLocalStorage('mySubjects', items.value)
  }

  function deleteItemById (id: number) {
    const index = items.value.findIndex(s => s.id === id)
    deleteItemByIndex(index)
    $storage.setLocalStorage('mySubjects', items.value)
  }

  function updateItem (item: ISubject) {
    const index = items.value.findIndex(s => s.id === item.id)
    updateItemByIndex({ index, item })
    $storage.setLocalStorage('mySubjects', items.value)
  }

  function updateItems (items: ISubject[]) {
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
