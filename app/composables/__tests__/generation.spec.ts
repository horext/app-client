import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import { useGenerationStore } from '~/stores/generation'

import { useGeneration } from '../generation'

const mockSaveGeneration = vi.fn()
const mockGetGenerations = vi.fn()
const mockGetLatestGeneration = vi.fn()

mockNuxtImport('useGenerationService', () =>
  vi.fn(() => ({
    saveGeneration: mockSaveGeneration,
    getGenerations: mockGetGenerations,
    getLatestGeneration: mockGetLatestGeneration,
  })),
)

describe('useGeneration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('returns result, history, setResult, loadSaved, and clear', () => {
    const gen = useGeneration()
    expect(gen.result).toBeDefined()
    expect(gen.history).toBeDefined()
    expect(gen.setResult).toBeTypeOf('function')
    expect(gen.loadSaved).toBeTypeOf('function')
    expect(gen.clear).toBeTypeOf('function')
  })

  it('setResult saves a generation and updates result and history', async () => {
    const savedResult = { id: '1', schedules: [] }
    const records = [{ id: '1' }]
    mockSaveGeneration.mockResolvedValue(savedResult)
    mockGetGenerations.mockResolvedValue(records)

    const { setResult } = useGeneration()
    await setResult([], [], { label: 'test', date: '2024-01-01' } as never)

    const store = useGenerationStore()
    expect(mockSaveGeneration).toHaveBeenCalled()
    expect(mockGetGenerations).toHaveBeenCalled()
    expect(store.result).toEqual(savedResult)
    expect(store.history).toEqual(records)
  })

  it('loadSaved fetches generations and latest generation', async () => {
    const records = [{ id: '1' }]
    const latest = { id: '1', schedules: [] }
    mockGetGenerations.mockResolvedValue(records)
    mockGetLatestGeneration.mockResolvedValue(latest)

    const { loadSaved } = useGeneration()
    await loadSaved()

    const store = useGenerationStore()
    expect(mockGetGenerations).toHaveBeenCalled()
    expect(mockGetLatestGeneration).toHaveBeenCalled()
    expect(store.history).toEqual(records)
    expect(store.result).toEqual(latest)
  })

  it('loadSaved sets result to null when latest generation is null', async () => {
    mockGetGenerations.mockResolvedValue([])
    mockGetLatestGeneration.mockResolvedValue(null)

    const { loadSaved } = useGeneration()
    await loadSaved()

    expect(useGenerationStore().result).toBeNull()
  })
})
