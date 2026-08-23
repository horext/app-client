import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import { useUserPreferencesStore } from '~/stores/user-preferences'
import type { IPreferencesService } from '#shared/application/interfaces/preferences.service'
import type { PreferenceID } from '#shared/domain/types/preferences'
import { makeUUID } from '#shared/domain/types/ids'
import { Preferences } from '#shared/domain'
import type { IUserPreferences } from '~/interfaces/preferences'

import { useUserPreferences } from '../user-preferences'

const mockGetPreferences = vi.fn()
const mockCreatePreferences = vi.fn()
const mockPatch = vi.fn()

function makePreferences(
  overrides: Partial<IUserPreferences> = {},
): IUserPreferences {
  return {
    id: makeUUID<PreferenceID>(),
    crossings: 0,
    weekDays: [1, 2],
    maxGenerationHistory: 5,
    ...overrides,
  }
}

const asEntity = (preferences: IUserPreferences) =>
  Preferences.reconstitute({
    ...preferences,
    id: preferences.id as PreferenceID,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdBy: 'user-1',
    updatedBy: 'user-1',
  })

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
    const prefs = makePreferences({ crossings: 2 })
    mockGetPreferences.mockResolvedValue(asEntity(prefs))
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
    const current = makePreferences()
    const updated = makePreferences({ ...current, crossings: 3 })
    store.preferences = current
    mockPatch.mockResolvedValue(asEntity(updated))
    const { updateCrossings } = useUserPreferences()
    await updateCrossings(3)
    expect(store.preferences).toEqual(updated)
    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), { crossings: 3 })
  })

  it('updateCrossings stores the service result when preferences is undefined', async () => {
    const updated = makePreferences({ crossings: 3 })
    mockPatch.mockResolvedValue(asEntity(updated))
    const { updateCrossings } = useUserPreferences()
    await updateCrossings(3)
    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), { crossings: 3 })
    expect(useUserPreferencesStore().preferences).toEqual(updated)
  })

  it('saveWeekDays updates preferences and patches service', async () => {
    const store = useUserPreferencesStore()
    const current = makePreferences({ weekDays: [1] })
    const updated = makePreferences({ ...current, weekDays: [1, 2, 3] })
    store.preferences = current
    mockPatch.mockResolvedValue(asEntity(updated))
    const { saveWeekDays } = useUserPreferences()
    await saveWeekDays([1, 2, 3] as never)
    expect(store.preferences).toEqual(updated)
    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), {
      weekDays: [1, 2, 3],
    })
  })

  it('saveWeekDays stores the service result when preferences is undefined', async () => {
    const updated = makePreferences({ weekDays: [1, 2] })
    mockPatch.mockResolvedValue(asEntity(updated))
    const { saveWeekDays } = useUserPreferences()
    await saveWeekDays([1, 2] as never)
    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), {
      weekDays: [1, 2],
    })
    expect(useUserPreferencesStore().preferences).toEqual(updated)
  })

  it('updateMaxGenerationHistory updates preferences and patches service', async () => {
    const store = useUserPreferencesStore()
    const current = makePreferences({ weekDays: [1] })
    const updated = makePreferences({ ...current, maxGenerationHistory: 20 })
    store.preferences = current
    mockPatch.mockResolvedValue(asEntity(updated))
    const { updateMaxGenerationHistory } = useUserPreferences()
    await updateMaxGenerationHistory(20)
    expect(store.preferences).toEqual(updated)
    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), {
      maxGenerationHistory: 20,
    })
  })

  it('updateMaxGenerationHistory stores the service result when preferences is undefined', async () => {
    const updated = makePreferences({ maxGenerationHistory: 20 })
    mockPatch.mockResolvedValue(asEntity(updated))
    const { updateMaxGenerationHistory } = useUserPreferences()
    await updateMaxGenerationHistory(20)
    expect(mockPatch).toHaveBeenCalledWith(expect.any(String), {
      maxGenerationHistory: 20,
    })
    expect(useUserPreferencesStore().preferences).toEqual(updated)
  })
})
