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
    await expect(academicConfig.create('user', {} as never)).rejects.toThrow()
    await expect(academicConfig.update('user', {} as never)).rejects.toThrow()

    const activities = new NoopActivitiesRepository()
    expect(await activities.getAll('user')).toEqual([])
    expect(await activities.get('user', 'id' as never)).toBeUndefined()
    await expect(activities.create('user', {} as never)).rejects.toThrow()
    await expect(activities.update('user', {} as never)).resolves.toEqual({})
    await expect(
      activities.delete('user', 'id' as never),
    ).resolves.toBeUndefined()

    const generations = new NoopGenerationRepository()
    expect(await generations.getAll('user')).toEqual([])
    expect(await generations.get('user', 'id' as never)).toBeUndefined()
    await expect(generations.create('user', {} as never)).rejects.toThrow()
    await expect(
      generations.delete('user', 'id' as never),
    ).resolves.toBeUndefined()

    const preferences = new NoopPreferencesRepository()
    expect(await preferences.get('user')).toBeUndefined()
    await expect(preferences.create('user', {} as never)).rejects.toThrow()
    await expect(preferences.update('user', {} as never)).rejects.toThrow()

    const profile = new NoopProfileRepository()
    expect(await profile.get('user')).toBeUndefined()
    await expect(profile.create('user', {} as never)).rejects.toThrow()
    await expect(profile.update('user', {} as never)).rejects.toThrow()

    const favorites = new NoopSchedulesFavoritesRepository()
    expect(await favorites.findAll('user')).toEqual([])
    expect(await favorites.findById('user', 'id' as never)).toBeUndefined()
    await expect(favorites.update('user', {} as never)).rejects.toThrow()
    await expect(
      favorites.delete('user', 'id' as never),
    ).resolves.toBeUndefined()

    const schedules = new NoopSchedulesRepository()
    expect(await schedules.findAll('user')).toEqual([])
    expect(await schedules.getEntries('user', [])).toEqual([])
    expect(await schedules.getByKey('user', 'key')).toBeUndefined()
    await expect(schedules.create('user', {} as never)).rejects.toThrow()
    await expect(schedules.createAll('user', [])).rejects.toThrow()
    await expect(schedules.update('user', {} as never)).resolves.toEqual({})
    await expect(
      schedules.deleteEntry('user', 'id' as never),
    ).resolves.toBeUndefined()
    await expect(schedules.deleteEntries('user', [])).resolves.toBeUndefined()

    const subjects = new NoopSubjectsRepository()
    expect(await subjects.getAll('user')).toEqual([])
    expect(await subjects.findById('user', 'id' as never)).toBeUndefined()
    await expect(subjects.create('user', {} as never)).rejects.toThrow()
    await expect(subjects.update('user', {} as never)).resolves.toEqual({})
    await expect(
      subjects.delete('user', 'id' as never),
    ).resolves.toBeUndefined()
  })
})
