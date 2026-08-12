import { describe, expect, it } from 'vitest'
import { Activity, DomainError, Preferences } from '#shared/domain'
import type { IPreferences } from '#shared/domain/types/preferences'
import { makeUUID } from '~~/shared/domain/types/ids'

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
        id: makeUUID(),
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
        id: makeUUID(),
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

  it('applies partial activity updates and preserves omitted values', () => {
    const activity = Activity.restore({
      id: makeUUID(),
      title: 'Study',
      color: '#112233',
      allowOverlap: true,
      sessions: [{ day: 1, startTime: '08:00', endTime: '09:00' }],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      createdBy: 'user-1',
      updatedBy: 'user-1',
    })

    expect(activity.update({ title: 'Updated' }).toSnapshot()).toMatchObject({
      title: 'Updated',
      color: '#112233',
      allowOverlap: true,
    })
  })

  it('revalidates preference business limits when restoring and updating', () => {
    const snapshot: IPreferences = {
      id: makeUUID(),
      weekDays: [1, 2, 3],
      crossings: 0,
      maxGenerationHistory: 10,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      createdBy: 'user-1',
      updatedBy: 'user-1',
    }
    const preferences = Preferences.restore({
      ...snapshot,
      weekDays: [...snapshot.weekDays],
    })

    expect(() => preferences.update({ maxGenerationHistory: 0 })).toThrowError(
      DomainError,
    )
  })
})
