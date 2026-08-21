import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import { isProxy, reactive } from 'vue'
import { useGenerationStore } from '~/stores/generation'
import { Schedule } from '~~/shared/domain'

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

  it('maps reactive schedules before domain entity creation', async () => {
    const schedule = reactive({
      scheduleSubjectKey: 'subject-1',
      schedulesSubject: [],
      crossings: 0,
      events: [
        {
          id: 'event-1',
          title: 'Class',
          day: 1 as const,
          color: '#3F51B5',
          type: 'CLASS',
          startTime: '08:00',
          endTime: '09:00',
        },
      ],
    })
    mockSaveGeneration.mockImplementation(async (_userId, _meta, schedules) => {
      expect(isProxy(schedules[0])).toBe(false)
      expect(isProxy(schedules[0].events[0])).toBe(false)
      expect(() => Schedule.create(schedules[0])).not.toThrow()
      return { id: 'generation-1', schedules: [] }
    })
    mockGetGenerations.mockResolvedValue([])

    const { setResult } = useGeneration()
    await expect(
      setResult([schedule], [], { label: 'test', date: '2026-08-21' } as never),
    ).resolves.toBeUndefined()
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
