import type { ISchedulesFavoritesRepository } from './schedules-repository.interface'

export class NoopSchedulesFavoritesRepository implements ISchedulesFavoritesRepository {
  findAll(_userId: string) {
    return Promise.resolve([])
  }
  findById(
    _userId: string,
    _id: Parameters<ISchedulesFavoritesRepository['findById']>[1],
  ) {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    _value: Parameters<ISchedulesFavoritesRepository['create']>[1],
  ) {
    return Promise.reject(new Error('Favorites repository is unavailable.'))
  }
  delete(
    _userId: string,
    _id: Parameters<ISchedulesFavoritesRepository['delete']>[1],
  ) {
    return Promise.resolve()
  }
}
