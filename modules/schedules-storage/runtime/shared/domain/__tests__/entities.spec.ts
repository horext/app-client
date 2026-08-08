import { describe, expect, it, vi } from 'vitest'
import { Activity, auditEntity, DomainError, Preferences } from '../index'

describe('shared domain entities', () => {
  it('normalizes an activity and round-trips its snapshot', () => {
    const activity = Activity.create({
      title: '  Study  ',
      description: '  Notes  ',
      color: '#112233',
      sessions: [{ day: 1, startTime: '08:00', endTime: '09:00' }],
    })
    const snapshot = activity.toSnapshot()
    expect(snapshot.title).toBe('Study')
    expect(snapshot.description).toBe('Notes')
    expect(Activity.restore(snapshot).toSnapshot()).toEqual(snapshot)
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

  it('generates identity only when creating a new entity', () => {
    const id = crypto.randomUUID()
    const generateId = vi.fn(() => id)
    const activity = Activity.create(
      {
        title: 'Study',
        color: '#112233',
        sessions: [],
      },
      generateId,
    )

    expect(activity.id).toBe(id)
    expect(generateId).toHaveBeenCalledOnce()
    expect(
      activity.update({
        title: 'Updated',
        color: '#112233',
        sessions: [],
      }).id,
    ).toBe(id)
    expect(Activity.restore(activity.toSnapshot()).id).toBe(id)
    expect(generateId).toHaveBeenCalledOnce()
  })

  it('preserves createdAt and advances updatedAt on update', () => {
    const activity = Activity.create(
      { title: 'Study', color: '#112233', sessions: [] },
      () => crypto.randomUUID(),
      () => '2026-08-08T13:00:00.000Z',
    )
    const updated = activity.update(
      { title: 'Updated', color: '#112233', sessions: [] },
      () => '2026-08-08T15:00:00.000Z',
    )

    expect(activity.toSnapshot().createdAt).toBe('2026-08-08T13:00:00.000Z')
    expect(updated.toSnapshot()).toMatchObject({
      createdAt: '2026-08-08T13:00:00.000Z',
      updatedAt: '2026-08-08T15:00:00.000Z',
    })
  })

  it('assigns ownership once and records the latest actor', () => {
    const created = auditEntity(
      Activity.create({
        title: 'Study',
        color: '#112233',
        sessions: [],
      }).toSnapshot(),
      'user-1',
    )
    const updated = auditEntity(created, 'user-1')

    expect(updated.createdBy).toBe('user-1')
    expect(updated.updatedBy).toBe('user-1')
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
