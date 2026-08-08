import type { ISchedulesFavoritesRepository } from './schedules-repository.interface'

export class NoopSchedulesFavoritesRepository implements ISchedulesFavoritesRepository {
  findAll() {
    return Promise.resolve([])
  }
  findById() {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    value: Parameters<ISchedulesFavoritesRepository['create']>[1],
  ) {
    return Promise.resolve(value)
  }
  delete() {
    return Promise.resolve()
  }
}
