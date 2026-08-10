import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'

export class NoopPreferencesRepository implements IPreferencesRepository {
  get(_userId: string) {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    _value: Parameters<IPreferencesRepository['create']>[1],
  ) {
    return Promise.reject(new Error('Preferences repository is unavailable.'))
  }
  update(
    _userId: string,
    _value: Parameters<IPreferencesRepository['update']>[1],
  ) {
    return Promise.reject(new Error('Preferences repository is unavailable.'))
  }
}
