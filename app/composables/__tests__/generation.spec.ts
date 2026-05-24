import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'

import { useGeneration } from '../generation'

const mockResult = ref<{ schedules: unknown[] } | null>(null)
const mockHistory = ref<unknown[]>([])
const mockClear = vi.fn()

const mockSaveGeneration = vi.fn()
const mockGetGenerations = vi.fn()
const mockGetLatestGeneration = vi.fn()

const mockMaxGenerationHistory = ref(5)

mockNuxtImport('useGenerationStore', () =>
  vi.fn(() => ({
    result: mockResult,
    history: mockHistory,
    clear: mockClear,
  })),
)

mockNuxtImport('useGenerationService', () =>
  vi.fn(() => ({
    saveGeneration: mockSaveGeneration,
    getGenerations: mockGetGenerations,
    getLatestGeneration: mockGetLatestGeneration,
  })),
)

mockNuxtImport('useUserPreferencesStore', () =>
  vi.fn(() => ({
    maxGenerationHistory: mockMaxGenerationHistory,
  })),
)

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  return {
    ...actual,
    storeToRefs: vi.fn((store) => store),
  }
})

describe('useGeneration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResult.value = null
    mockHistory.value = []
  })

  it('returns result, history, setResult, loadSaved, and clear', () => {
    const gen = useGeneration()
    expect(gen.result).toBeDefined()
    expect(gen.history).toBeDefined()
    expect(gen.setResult).toBeTypeOf('function')
    expect(gen.loadSaved).toBeTypeOf('function')
    expect(gen.clear).toBe(mockClear)
  })

  it('setResult saves a generation and updates result and history', async () => {
    const savedResult = { id: '1', schedules: [] }
    const records = [{ id: '1' }]
    mockSaveGeneration.mockResolvedValue(savedResult)
    mockGetGenerations.mockResolvedValue(records)

    const { setResult } = useGeneration()
    await setResult([], [], { label: 'test', date: '2024-01-01' } as never)

    expect(mockSaveGeneration).toHaveBeenCalled()
    expect(mockGetGenerations).toHaveBeenCalled()
    expect(mockResult.value).toEqual(savedResult)
    expect(mockHistory.value).toEqual(records)
  })

  it('loadSaved fetches generations and latest generation', async () => {
    const records = [{ id: '1' }]
    const latest = { id: '1', schedules: [] }
    mockGetGenerations.mockResolvedValue(records)
    mockGetLatestGeneration.mockResolvedValue(latest)

    const { loadSaved } = useGeneration()
    await loadSaved()

    expect(mockGetGenerations).toHaveBeenCalled()
    expect(mockGetLatestGeneration).toHaveBeenCalled()
    expect(mockHistory.value).toEqual(records)
    expect(mockResult.value).toEqual(latest)
  })

  it('loadSaved sets result to null when latest generation is null', async () => {
    mockGetGenerations.mockResolvedValue([])
    mockGetLatestGeneration.mockResolvedValue(null)

    const { loadSaved } = useGeneration()
    await loadSaved()

    expect(mockResult.value).toBeNull()
  })
})
