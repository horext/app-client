import type { IPreferencesRepository } from './preferences-repository.interface'

export class NoopPreferencesRepository implements IPreferencesRepository {
  get() {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    value: Parameters<IPreferencesRepository['create']>[1],
  ) {
    return Promise.resolve(value)
  }
  update(
    _userId: string,
    value: Parameters<IPreferencesRepository['update']>[1],
  ) {
    return Promise.resolve(value)
  }
}
