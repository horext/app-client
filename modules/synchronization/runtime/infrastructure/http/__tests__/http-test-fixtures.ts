import { makeUUID } from '~~/shared/domain/types/ids'
import { vi } from 'vitest'
import type { IActivity } from '#shared/domain/types/event'

export function installFetchMock() {
  const raw = vi.fn()
  const fetch = Object.assign(vi.fn(), { raw })
  vi.stubGlobal('$fetch', fetch)
  return { fetch, raw }
}

export function activitySnapshot(): IActivity {
  const timestamp = '2026-01-01T00:00:00.000Z'
  return {
    id: makeUUID(),
    title: 'Study',
    color: '#ffffff',
    allowOverlap: false,
    sessions: [{ day: 1, startTime: '09:00', endTime: '10:00' }],
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: 'user-1',
    updatedBy: 'user-1',
  }
}
