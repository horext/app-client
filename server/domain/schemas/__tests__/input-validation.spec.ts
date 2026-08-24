import { describe, expect, it } from 'vitest'
import {
  baseActivitySchema,
  profileCreateSchema,
} from '~~/server/domain/schemas'

describe('HTTP input schemas', () => {
  it('rejects malformed activity input', () => {
    expect(
      baseActivitySchema.safeParse({
        title: '',
        color: '#fff',
        sessions: [{ day: 8, startTime: '10:00', endTime: '09:00' }],
      }).success,
    ).toBe(false)
  })

  it('rejects malformed profile input', () => {
    expect(
      profileCreateSchema.safeParse({
        facultyId: 'faculty',
        specialityId: 1,
      }).success,
    ).toBe(false)
  })
})
