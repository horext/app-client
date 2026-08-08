import { describe, expect, it } from 'vitest'
import {
  NoopAcademicConfigRepository,
  NoopActivitiesRepository,
  NoopGenerationRepository,
  NoopPreferencesRepository,
  NoopProfileRepository,
  NoopSchedulesFavoritesRepository,
  NoopSchedulesRepository,
  NoopSubjectsRepository,
} from '../noop.repositories'

describe('noop repositories', () => {
  it('provide safe server-side defaults for every repository operation', async () => {
    const academicConfig = new NoopAcademicConfigRepository()
    expect(await academicConfig.get('user')).toBeUndefined()
    expect(await academicConfig.create('user', {} as never)).toEqual({})
    expect(await academicConfig.update('user', {} as never)).toEqual({})

    const activities = new NoopActivitiesRepository()
    expect(await activities.getAll('user')).toEqual([])
    expect(await activities.get('user', 'id' as never)).toBeUndefined()
    expect(await activities.create('user', {} as never)).toEqual({})
    expect(await activities.update('user', {} as never)).toEqual({})
    await expect(
      activities.delete('user', 'id' as never),
    ).resolves.toBeUndefined()

    const generations = new NoopGenerationRepository()
    expect(await generations.getAll('user')).toEqual([])
    expect(await generations.get('user', 'id' as never)).toBeUndefined()
    expect(await generations.create('user', {} as never)).toEqual({})
    await expect(
      generations.delete('user', 'id' as never),
    ).resolves.toBeUndefined()

    const preferences = new NoopPreferencesRepository()
    expect(await preferences.get('user')).toBeUndefined()
    expect(await preferences.create('user', {} as never)).toEqual({})
    expect(await preferences.update('user', {} as never)).toEqual({})

    const profile = new NoopProfileRepository()
    expect(await profile.get('user')).toBeUndefined()
    expect(await profile.create('user', {} as never)).toEqual({})
    expect(await profile.update('user', {} as never)).toEqual({})

    const favorites = new NoopSchedulesFavoritesRepository()
    expect(await favorites.findAll('user')).toEqual([])
    expect(await favorites.findById('user', 'id' as never)).toBeUndefined()
    expect(await favorites.create('user', {} as never)).toEqual({})
    await expect(
      favorites.delete('user', 'id' as never),
    ).resolves.toBeUndefined()

    const schedules = new NoopSchedulesRepository()
    expect(await schedules.findAll('user')).toEqual([])
    expect(await schedules.getEntries('user', [])).toEqual([])
    expect(await schedules.getByKey('user', 'key')).toBeUndefined()
    expect(await schedules.create('user', {} as never)).toEqual({})
    expect(await schedules.createAll('user', [])).toEqual([])
    expect(await schedules.update('user', {} as never)).toEqual({})
    await expect(
      schedules.deleteEntry('user', 'id' as never),
    ).resolves.toBeUndefined()
    await expect(schedules.deleteEntries('user', [])).resolves.toBeUndefined()

    const subjects = new NoopSubjectsRepository()
    expect(await subjects.getAll('user')).toEqual([])
    expect(await subjects.findById('user', 'id' as never)).toBeUndefined()
    expect(await subjects.create('user', {} as never)).toEqual({})
    expect(await subjects.update('user', {} as never)).toEqual({})
    await expect(
      subjects.delete('user', 'id' as never),
    ).resolves.toBeUndefined()
  })
})
