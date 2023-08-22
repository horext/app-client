import { ref } from 'vue'
import { defineStore } from 'pinia'
import { $storage } from '~/utils/api'
import { ISchedule } from '~/interfaces/schedule'

export const userUserSchedulesStore = defineStore('user/schedules', () => {
  const items = ref<ISchedule[]>([])

  const setItems = (newItems: ISchedule[]) => {
    items.value = newItems
  }

  const addItem = (item: ISchedule) => {
    items.value.push(Object.assign({}, item))
  }

  const deleteItemByIndex = (index: number) => {
    items.value.splice(index, 1)
  }

  const updateItemByIndex = ({
    index,
    item,
  }: {
    item: ISchedule
    index: number
  }) => {
    items.value = items.value.map((c: any, i: any) => (i === index ? item : c))
  }

  const saveNewItem = (item: ISchedule) => {
    addItem(item)
    $storage.setLocalStorage('mySchedules', items.value)
  }

  const deleteItemById = (id: string) => {
    const index = items.value.findIndex((s) => s.id === id)
    deleteItemByIndex(index)
    $storage.setLocalStorage('mySchedules', items.value)
  }

  const updateItem = (item: ISchedule) => {
    const index = items.value.findIndex((s) => s.id === item.id)
    updateItemByIndex({ index, item })
    $storage.setLocalStorage('mySchedules', items.value)
  }

  const updateItems = (newItems: ISchedule[]) => {
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
    fetchItems,
  }
})
