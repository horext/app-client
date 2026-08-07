import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import type { IScheduleGenerate } from '~/interfaces/schedule'
import { useGenerationStore } from '~/stores/generation'

import { useUserSchedules } from '../user-schedules'

const mockLoadSaved = vi.fn()

mockNuxtImport('useGeneration', () =>
  vi.fn(() => ({
    loadSaved: mockLoadSaved,
  })),
)

describe('useUserSchedules', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('returns mySchedules, updateSchedules, and fetchSchedules', () => {
    const result = useUserSchedules()
    expect(result.mySchedules).toBeDefined()
    expect(result.updateSchedules).toBeTypeOf('function')
    expect(result.fetchSchedules).toBe(mockLoadSaved)
  })

  it('mySchedules is an empty array when result is null', () => {
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
    useGenerationStore().result = { schedules } as never
    const { mySchedules } = useUserSchedules()
    expect(mySchedules.value).toEqual(schedules)
  })

  it('updateSchedules sets schedules on the result when result exists', async () => {
    useGenerationStore().result = { schedules: [] } as never
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
    expect(useGenerationStore().result?.schedules).toEqual(newSchedules)
  })

  it('updateSchedules does nothing when result is null', async () => {
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
    expect(useGenerationStore().result).toBeNull()
  })
})
