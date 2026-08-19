import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import { useUserPreferencesStore } from '~/stores/user-preferences'
import type { IPreferencesService } from '#shared/application/interfaces/preferences.service'

import { useUserPreferences } from '../user-preferences'

const mockGetPreferences = vi.fn()
const mockCreatePreferences = vi.fn()
const mockPatch = vi.fn()

mockNuxtImport('usePreferencesService', () =>
  vi.fn(
    () =>
      ({
        get: mockGetPreferences,
        create: mockCreatePreferences,
        patch: mockPatch,
      }) satisfies IPreferencesService,
  ),
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

  it('fetchPreferences calls service.get and sets preferences when result is truthy', async () => {
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

  it('createPreferences calls service.create', async () => {
    const created = {
      id: crypto.randomUUID(),
      crossings: 0,
      weekDays: [1, 2],
      maxGenerationHistory: 10,
    }
    mockCreatePreferences.mockResolvedValue(created)
    const { createPreferences } = useUserPreferences()
    await createPreferences()
    expect(mockCreatePreferences).toHaveBeenCalled()
    expect(useUserPreferencesStore().preferences).toEqual(created)
  })

  it('updateCrossings updates preferences and patches service', async () => {
    const store = useUserPreferencesStore()
    store.preferences = {
      id: crypto.randomUUID(),
      crossings: 0,
      weekDays: [1, 2],
      maxGenerationHistory: 5,
    }
    mockPatch.mockResolvedValue(undefined)
    const { updateCrossings } = useUserPreferences()
    await updateCrossings(3)
    expect(store.preferences?.crossings).toBe(3)
    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), { crossings: 3 })
  })

  it('updateCrossings creates preferences when they do not exist', async () => {
    const created = {
      id: crypto.randomUUID(),
      crossings: 3,
      weekDays: [1, 2, 3, 4, 5, 6],
      maxGenerationHistory: 10,
    }
    mockCreatePreferences.mockResolvedValue(created)
    const { updateCrossings } = useUserPreferences()
    await updateCrossings(3)
    expect(mockCreatePreferences).toHaveBeenCalledWith(expect.any(String), {
      crossings: 3,
    })
    expect(mockPatch).not.toHaveBeenCalled()
    expect(useUserPreferencesStore().preferences).toEqual(created)
  })

  it('saveWeekDays updates preferences and patches service', async () => {
    const store = useUserPreferencesStore()
    store.preferences = {
      id: crypto.randomUUID(),
      crossings: 0,
      weekDays: [1],
      maxGenerationHistory: 5,
    }
    mockPatch.mockResolvedValue(undefined)
    const { saveWeekDays } = useUserPreferences()
    await saveWeekDays([1, 2, 3] as never)
    expect(store.preferences?.weekDays).toEqual([1, 2, 3])
    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), {
      weekDays: [1, 2, 3],
    })
  })

  it('saveWeekDays skips store update when preferences is undefined', async () => {
    mockPatch.mockResolvedValue(undefined)
    const { saveWeekDays } = useUserPreferences()
    await saveWeekDays([1, 2] as never)
    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), {
      weekDays: [1, 2],
    })
  })

  it('updateMaxGenerationHistory updates preferences and patches service', async () => {
    const store = useUserPreferencesStore()
    store.preferences = {
      id: crypto.randomUUID(),
      crossings: 0,
      weekDays: [1],
      maxGenerationHistory: 5,
    }
    mockPatch.mockResolvedValue(undefined)
    const { updateMaxGenerationHistory } = useUserPreferences()
    await updateMaxGenerationHistory(20)
    expect(store.preferences?.maxGenerationHistory).toBe(20)
    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), {
      maxGenerationHistory: 20,
    })
  })

  it('updateMaxGenerationHistory skips store update when preferences is undefined', async () => {
    mockPatch.mockResolvedValue(undefined)
    const { updateMaxGenerationHistory } = useUserPreferences()
    await updateMaxGenerationHistory(20)
    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), {
      maxGenerationHistory: 20,
    })
  })
})
