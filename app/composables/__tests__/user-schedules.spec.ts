import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import type { IScheduleGenerate } from '~/interfaces/schedule'

import { useUserSchedules } from '../user-schedules'

const mockResult = ref<{ schedules: IScheduleGenerate[] } | null>(null)
const mockLoadSaved = vi.fn()

mockNuxtImport('useGenerationStore', () =>
  vi.fn(() => ({
    result: mockResult,
  })),
)

mockNuxtImport('useGeneration', () =>
  vi.fn(() => ({
    loadSaved: mockLoadSaved,
    result: mockResult,
  })),
)

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  return {
    ...actual,
    storeToRefs: vi.fn((store) => store),
  }
})

describe('useUserSchedules', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResult.value = null
  })

  it('returns mySchedules, updateSchedules, and fetchSchedules', () => {
    const result = useUserSchedules()
    expect(result.mySchedules).toBeDefined()
    expect(result.updateSchedules).toBeTypeOf('function')
    expect(result.fetchSchedules).toBe(mockLoadSaved)
  })

  it('mySchedules is an empty array when result is null', () => {
    mockResult.value = null
    const { mySchedules } = useUserSchedules()
    expect(mySchedules.value).toEqual([])
  })

  it('mySchedules returns schedules from result when available', () => {
    const schedules: IScheduleGenerate[] = [
      {
        id: crypto.randomUUID(),
        events: [],
        scheduleSubjectKey: '',
        schedulesSubject: [],
        crossings: 0,
      },
    ]
    mockResult.value = { schedules }
    const { mySchedules } = useUserSchedules()
    expect(mySchedules.value).toEqual(schedules)
  })

  it('updateSchedules sets schedules on the result when result exists', async () => {
    mockResult.value = { schedules: [] }
    const newSchedules: IScheduleGenerate[] = [
      {
        id: crypto.randomUUID(),
        events: [],
        scheduleSubjectKey: '',
        schedulesSubject: [],
        crossings: 0,
      },
    ]
    const { updateSchedules } = useUserSchedules()
    await updateSchedules(newSchedules)
    expect(mockResult.value.schedules).toEqual(newSchedules)
  })

  it('updateSchedules does nothing when result is null', async () => {
    mockResult.value = null
    const newSchedules: IScheduleGenerate[] = [
      {
        id: crypto.randomUUID(),
        events: [],
        scheduleSubjectKey: '',
        schedulesSubject: [],
        crossings: 0,
      },
    ]
    const { updateSchedules } = useUserSchedules()
    await updateSchedules(newSchedules)
    expect(mockResult.value).toBeNull()
  })
})
