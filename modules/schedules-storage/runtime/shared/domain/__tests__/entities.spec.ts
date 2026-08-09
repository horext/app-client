import { describe, expect, it } from 'vitest'
import { Activity, DomainError, Preferences } from '../index'

describe('shared domain entities', () => {
  it('round-trips an activity snapshot', () => {
    const activity = Activity.create({
      title: '  Study  ',
      description: '  Notes  ',
      color: '#112233',
      sessions: [{ day: 1, startTime: '08:00', endTime: '09:00' }],
    })
    const snapshot = activity.toSnapshot()
    expect(snapshot.title).toBe('  Study  ')
    expect(snapshot.description).toBe('  Notes  ')
    expect(
      Activity.restore({
        ...snapshot,
        id: crypto.randomUUID(),
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        createdBy: 'user-1',
        updatedBy: 'user-1',
      }).toSnapshot(),
    ).toMatchObject(snapshot)
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

  it('leaves identity creation to the repository', () => {
    const activity = Activity.create({
      title: 'Study',
      color: '#112233',
      sessions: [],
    })

    expect(() => activity.id).toThrow()
    expect(
      Activity.restore({
        ...activity.toSnapshot(),
        id: crypto.randomUUID(),
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        createdBy: 'user-1',
        updatedBy: 'user-1',
      }).id,
    ).toBeDefined()
  })

  it('rejects an empty generation-history limit', () => {
    expect(() =>
      Preferences.create({
        weekDays: [1, 2, 3],
        crossings: 0,
        maxGenerationHistory: 0,
      }),
    ).toThrowError(DomainError)
  })
})
