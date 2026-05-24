import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'

import { useUserPreferences } from '../user-preferences'

const mockPreferences = ref<
  | { crossings: number; weekDays: number[]; maxGenerationHistory: number }
  | undefined
>(undefined)
const mockWeekDays = ref([1, 2, 3, 4, 5])
const mockCrossings = ref(0)
const mockMaxGenerationHistory = ref(5)

const { mockStoreToRefs } = vi.hoisted(() => ({
  mockStoreToRefs: vi.fn((store: Record<string, unknown>) => store),
}))

const mockGetPreferences = vi.fn()
const mockCreatePreferences = vi.fn()
const mockPatch = vi.fn()

mockNuxtImport('useUserPreferencesStore', () =>
  vi.fn(() => ({
    preferences: mockPreferences,
    weekDays: mockWeekDays,
    crossings: mockCrossings,
    maxGenerationHistory: mockMaxGenerationHistory,
  })),
)

mockNuxtImport('usePreferencesService', () =>
  vi.fn(() => ({
    getPreferences: mockGetPreferences,
    createPreferences: mockCreatePreferences,
    patch: mockPatch,
  })),
)

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  return {
    ...actual,
    storeToRefs: mockStoreToRefs,
  }
})

describe('useUserPreferences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPreferences.value = undefined
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
    expect(mockPreferences.value).toEqual(prefs)
  })

  it('fetchPreferences does not update preferences when service returns falsy', async () => {
    mockGetPreferences.mockResolvedValue(null)
    mockPreferences.value = undefined
    const { fetchPreferences } = useUserPreferences()
    await fetchPreferences()
    expect(mockPreferences.value).toBeUndefined()
  })

  it('createPreferences calls service.createPreferences', async () => {
    mockCreatePreferences.mockResolvedValue(undefined)
    const { createPreferences } = useUserPreferences()
    await createPreferences()
    expect(mockCreatePreferences).toHaveBeenCalled()
  })

  it('updateCrossings updates preferences and patches service', async () => {
    mockPreferences.value = {
      crossings: 0,
      weekDays: [1, 2],
      maxGenerationHistory: 5,
    }
    mockPatch.mockResolvedValue(undefined)
    const { updateCrossings } = useUserPreferences()
    await updateCrossings(3)
    expect(mockPreferences.value?.crossings).toBe(3)
    expect(mockPatch).toHaveBeenCalledWith({ crossings: 3 })
  })

  it('updateCrossings skips store update when preferences is undefined', async () => {
    mockPreferences.value = undefined
    mockPatch.mockResolvedValue(undefined)
    const { updateCrossings } = useUserPreferences()
    await updateCrossings(3)
    expect(mockPatch).toHaveBeenCalledWith({ crossings: 3 })
    expect(mockPreferences.value).toBeUndefined()
  })

  it('saveWeekDays updates preferences and patches service', async () => {
    mockPreferences.value = {
      crossings: 0,
      weekDays: [1],
      maxGenerationHistory: 5,
    }
    mockPatch.mockResolvedValue(undefined)
    const { saveWeekDays } = useUserPreferences()
    await saveWeekDays([1, 2, 3] as never)
    expect(mockPreferences.value?.weekDays).toEqual([1, 2, 3])
    expect(mockPatch).toHaveBeenCalledWith({ weekDays: [1, 2, 3] })
  })

  it('saveWeekDays skips store update when preferences is undefined', async () => {
    mockPreferences.value = undefined
    mockPatch.mockResolvedValue(undefined)
    const { saveWeekDays } = useUserPreferences()
    await saveWeekDays([1, 2] as never)
    expect(mockPatch).toHaveBeenCalledWith({ weekDays: [1, 2] })
  })

  it('updateMaxGenerationHistory updates preferences and patches service', async () => {
    mockPreferences.value = {
      crossings: 0,
      weekDays: [1],
      maxGenerationHistory: 5,
    }
    mockPatch.mockResolvedValue(undefined)
    const { updateMaxGenerationHistory } = useUserPreferences()
    await updateMaxGenerationHistory(20)
    expect(mockPreferences.value?.maxGenerationHistory).toBe(20)
    expect(mockPatch).toHaveBeenCalledWith({ maxGenerationHistory: 20 })
  })

  it('updateMaxGenerationHistory skips store update when preferences is undefined', async () => {
    mockPreferences.value = undefined
    mockPatch.mockResolvedValue(undefined)
    const { updateMaxGenerationHistory } = useUserPreferences()
    await updateMaxGenerationHistory(20)
    expect(mockPatch).toHaveBeenCalledWith({ maxGenerationHistory: 20 })
  })
})
