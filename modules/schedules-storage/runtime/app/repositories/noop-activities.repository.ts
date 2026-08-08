import type { IActivitiesRepository } from './activities.repository.interface'

export class NoopActivitiesRepository implements IActivitiesRepository {
  getAll() {
    return Promise.resolve([])
  }
  get() {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    value: Parameters<IActivitiesRepository['create']>[1],
  ) {
    return Promise.resolve(value)
  }
  update(
    _userId: string,
    value: Parameters<IActivitiesRepository['update']>[1],
  ) {
    return Promise.resolve(value)
  }
  delete() {
    return Promise.resolve()
  }
}
