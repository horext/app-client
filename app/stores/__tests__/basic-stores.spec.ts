import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { UUID } from 'crypto'
import type { IActivity } from '~/interfaces/event'
import type {
  IGenerationResult,
  IGenerationRecord,
} from '~/interfaces/generation-record'
import { useUserAuthStore } from '~/stores/user-auth'
import { useGenerationStore } from '~/stores/generation'
import { useUserFavoritesStore } from '~/stores/user-favorites'
import { useUserEventsStore } from '~/stores/user-events'
import { useUserSubjectsStore } from '~/stores/user-subjects'

describe('useUserAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with no user', () => {
    const store = useUserAuthStore()
    expect(store.user).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })

  it('sets user and isLoggedIn becomes true', () => {
    const store = useUserAuthStore()
    store.setUser({ email: 'test@example.com', name: 'Test' })
    expect(store.user).toEqual({ email: 'test@example.com', name: 'Test' })
    expect(store.isLoggedIn).toBe(true)
  })

  it('clears user', () => {
    const store = useUserAuthStore()
    store.setUser({ name: 'Test' })
    store.clearUser()
    expect(store.user).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })
})

describe('useGenerationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with null result and empty history', () => {
    const store = useGenerationStore()
    expect(store.result).toBeNull()
    expect(store.history).toEqual([])
  })

  it('clears result and history', () => {
    const store = useGenerationStore()
    store.result = {
      id: 'g1' as UUID,
      schedules: [],
      occurrences: [],
      scheduleIds: [],
      generatedAt: '',
      resultCount: 0,
      crossingsSetting: 0,
      weekDays: [],
      hourlyLoadId: 0,
    } satisfies IGenerationResult
    store.history = [
      {
        generatedAt: '',
        scheduleIds: [],
        occurrences: [],
        crossingsSetting: 0,
        weekDays: [],
        hourlyLoadId: 0,
        resultCount: 0,
      },
    ] satisfies IGenerationRecord[]
    store.clear()
    expect(store.result).toBeNull()
    expect(store.history).toEqual([])
  })
})

describe('useUserFavoritesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with empty favorites', () => {
    const store = useUserFavoritesStore()
    expect(store.favoritesSchedules).toEqual([])
  })
})

describe('useUserEventsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with empty items', () => {
    const store = useUserEventsStore()
    expect(store.items).toEqual([])
  })

  it('sets items', () => {
    const store = useUserEventsStore()
    store.setItems([
      {
        id: '1' as UUID,
        title: 'event',
        color: '#fff',
        day: 1,
        type: 'MY_EVENT',
        startTime: '08:00',
        endTime: '09:00',
        category: 'MY_EVENT',
      } satisfies IActivity,
    ])
    expect(store.items).toHaveLength(1)
  })

  it('updates an item', () => {
    const store = useUserEventsStore()
    const item: IActivity = {
      id: '1' as UUID,
      title: 'event',
      color: '#fff',
      day: 1,
      type: 'MY_EVENT',
      startTime: '08:00',
      endTime: '09:00',
      category: 'MY_EVENT',
    }
    store.setItems([item])
    store.updateItem({ ...item, title: 'updated' })
    expect(store.items[0]!.title).toBe('updated')
  })

  it('does nothing when updating nonexistent item', () => {
    const store = useUserEventsStore()
    store.setItems([
      {
        id: '1' as UUID,
        title: 'event',
        color: '#fff',
        day: 1,
        type: 'MY_EVENT',
        startTime: '08:00',
        endTime: '09:00',
        category: 'MY_EVENT',
      } satisfies IActivity,
    ])
    store.updateItem({
      id: '99' as UUID,
      title: 'x',
      color: '#000',
      day: 1,
      type: 'MY_EVENT',
      startTime: '08:00',
      endTime: '09:00',
      category: 'MY_EVENT',
    })
    expect(store.items[0]!.title).toBe('event')
  })

  it('deletes item by id', () => {
    const store = useUserEventsStore()
    store.setItems([
      {
        id: '1' as UUID,
        title: 'event',
        color: '#fff',
        day: 1,
        type: 'MY_EVENT',
        startTime: '08:00',
        endTime: '09:00',
        category: 'MY_EVENT',
      } satisfies IActivity,
    ])
    store.deleteItemById('1' as UUID)
    expect(store.items).toEqual([])
  })
})

describe('useUserSubjectsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with empty subjects', () => {
    const store = useUserSubjectsStore()
    expect(store.subjects).toEqual([])
  })
})
