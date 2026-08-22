import { describe, expect, it } from 'vitest'
import {
  Activity,
  BaseActivity,
  DomainError,
  Preferences,
} from '#shared/domain'
import type { IPreferences } from '#shared/domain/types/preferences'
import { makeUUID } from '~~/shared/domain/types/ids'
import type { ActivityID } from '#shared/domain/types/event'

const audit = {
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdBy: 'user-1',
  updatedBy: 'user-1',
}

describe('shared domain entities', () => {
  it('creates a base activity without persistence identity', () => {
    const activity = Activity.create({
      title: 'Study',
      color: '#112233',
      sessions: [],
    })

    expect(activity).toBeInstanceOf(BaseActivity)
    expect(activity).not.toBeInstanceOf(Activity)
    expect('id' in activity).toBe(false)
  })

  it('reconstitutes a persisted activity with identity', () => {
    const id = makeUUID<ActivityID>()
    const activity = Activity.reconstitute({
      id,
      title: 'Study',
      color: '#112233',
      sessions: [],
      ...audit,
    })

    expect(activity).toBeInstanceOf(Activity)
    expect(activity.id).toBe(id)
  })

  it('rejects invalid activity time ranges', () => {
    expect(() =>
      Activity.create({
        title: 'Study',
        color: '#112233',
        sessions: [{ day: 1, startTime: '10:00', endTime: '09:00' }],
      }),
    ).toThrowError(DomainError)
  })

  it('mutates and returns the same persisted entity', () => {
    const activity = Activity.reconstitute({
      id: makeUUID(),
      title: 'Study',
      color: '#112233',
      allowOverlap: true,
      sessions: [{ day: 1, startTime: '08:00', endTime: '09:00' }],
      ...audit,
    })

    expect(activity.update({ title: 'Updated' })).toBe(activity)
    expect(activity.title).toBe('Updated')
    expect(activity.allowOverlap).toBe(true)
  })

  it('does not partially mutate when validation fails', () => {
    const activity = Activity.reconstitute({
      id: makeUUID(),
      title: 'Study',
      color: '#112233',
      sessions: [{ day: 1, startTime: '08:00', endTime: '09:00' }],
      ...audit,
    })

    expect(() =>
      activity.update({
        title: 'Invalid update',
        sessions: [{ day: 1, startTime: '10:00', endTime: '09:00' }],
      }),
    ).toThrowError(DomainError)
    expect(activity.title).toBe('Study')
  })

  it('takes ownership of collection inputs when creating an entity', () => {
    const sessions = [{ day: 1 as const, startTime: '08:00', endTime: '09:00' }]
    const activity = Activity.create({
      title: 'Study',
      color: '#112233',
      sessions,
    })
    sessions[0]!.startTime = '12:00'

    expect(activity.sessions[0]!.startTime).toBe('08:00')
  })

  it('rejects invalid preference history without mutating current state', () => {
    const snapshot: IPreferences = {
      id: makeUUID(),
      weekDays: [1, 2, 3],
      crossings: 0,
      maxGenerationHistory: 10,
      ...audit,
    }
    const preferences = Preferences.reconstitute(snapshot)

    expect(() =>
      preferences.update({ maxGenerationHistory: 0, crossings: 3 }),
    ).toThrowError(DomainError)
    expect(preferences.maxGenerationHistory).toBe(10)
    expect(preferences.crossings).toBe(0)
  })
})
