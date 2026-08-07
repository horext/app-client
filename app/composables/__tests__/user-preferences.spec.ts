import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import { useUserPreferencesStore } from '~/stores/user-preferences'

import { useUserPreferences } from '../user-preferences'

const mockGetPreferences = vi.fn()
const mockCreatePreferences = vi.fn()
const mockPatch = vi.fn()

mockNuxtImport('usePreferencesService', () =>
  vi.fn(() => ({
    getPreferences: mockGetPreferences,
    createPreferences: mockCreatePreferences,
    patch: mockPatch,
  })),
)

describe('useUserPreferences', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('returns preferences, weekDays, crossings, and maxGenerationHistory', () => {
    const { preferences, weekDays, crossings, maxGenerationHistory } =
      useUserPreferences()
    expect(preferences).toBeDefined()
    expect(weekDays).toBeDefined()
    expect(crossings).toBeDefined()
    expect(maxGenerationHistory).toBeDefined()
  })

  it('fetchPreferences calls service.getPreferences and sets preferences when result is truthy', async () => {
    const prefs = { crossings: 2, weekDays: [1, 2], maxGenerationHistory: 10 }
    mockGetPreferences.mockResolvedValue(prefs)
    const { fetchPreferences } = useUserPreferences()
    await fetchPreferences()
    expect(mockGetPreferences).toHaveBeenCalled()
    expect(useUserPreferencesStore().preferences).toEqual(prefs)
  })

  it('fetchPreferences does not update preferences when service returns falsy', async () => {
    mockGetPreferences.mockResolvedValue(null)
    const { fetchPreferences } = useUserPreferences()
    await fetchPreferences()
    expect(useUserPreferencesStore().preferences).toBeUndefined()
  })

  it('createPreferences calls service.createPreferences', async () => {
    mockCreatePreferences.mockResolvedValue(undefined)
    const { createPreferences } = useUserPreferences()
    await createPreferences()
    expect(mockCreatePreferences).toHaveBeenCalled()
  })

  it('updateCrossings updates preferences and patches service', async () => {
    const store = useUserPreferencesStore()
    store.preferences = {
      id: 'preferences',
      crossings: 0,
      weekDays: [1, 2],
      maxGenerationHistory: 5,
    }
    mockPatch.mockResolvedValue(undefined)
    const { updateCrossings } = useUserPreferences()
    await updateCrossings(3)
    expect(store.preferences?.crossings).toBe(3)
    expect(mockPatch).toHaveBeenCalledWith({ crossings: 3 })
  })

  it('updateCrossings skips store update when preferences is undefined', async () => {
    mockPatch.mockResolvedValue(undefined)
    const { updateCrossings } = useUserPreferences()
    await updateCrossings(3)
    expect(mockPatch).toHaveBeenCalledWith({ crossings: 3 })
    expect(useUserPreferencesStore().preferences).toBeUndefined()
  })

  it('saveWeekDays updates preferences and patches service', async () => {
    const store = useUserPreferencesStore()
    store.preferences = {
      id: 'preferences',
      crossings: 0,
      weekDays: [1],
      maxGenerationHistory: 5,
    }
    mockPatch.mockResolvedValue(undefined)
    const { saveWeekDays } = useUserPreferences()
    await saveWeekDays([1, 2, 3] as never)
    expect(store.preferences?.weekDays).toEqual([1, 2, 3])
    expect(mockPatch).toHaveBeenCalledWith({ weekDays: [1, 2, 3] })
  })

  it('saveWeekDays skips store update when preferences is undefined', async () => {
    mockPatch.mockResolvedValue(undefined)
    const { saveWeekDays } = useUserPreferences()
    await saveWeekDays([1, 2] as never)
    expect(mockPatch).toHaveBeenCalledWith({ weekDays: [1, 2] })
  })

  it('updateMaxGenerationHistory updates preferences and patches service', async () => {
    const store = useUserPreferencesStore()
    store.preferences = {
      id: 'preferences',
      crossings: 0,
      weekDays: [1],
      maxGenerationHistory: 5,
    }
    mockPatch.mockResolvedValue(undefined)
    const { updateMaxGenerationHistory } = useUserPreferences()
    await updateMaxGenerationHistory(20)
    expect(store.preferences?.maxGenerationHistory).toBe(20)
    expect(mockPatch).toHaveBeenCalledWith({ maxGenerationHistory: 20 })
  })

  it('updateMaxGenerationHistory skips store update when preferences is undefined', async () => {
    mockPatch.mockResolvedValue(undefined)
    const { updateMaxGenerationHistory } = useUserPreferences()
    await updateMaxGenerationHistory(20)
    expect(mockPatch).toHaveBeenCalledWith({ maxGenerationHistory: 20 })
  })
})
