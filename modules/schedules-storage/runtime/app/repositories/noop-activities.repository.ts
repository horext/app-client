import type { IActivitiesRepository } from './activities.repository.interface'

export class NoopActivitiesRepository implements IActivitiesRepository {
  getAll(_userId: string) {
    return Promise.resolve([])
  }
  get(_userId: string, _id: Parameters<IActivitiesRepository['get']>[1]) {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    _value: Parameters<IActivitiesRepository['create']>[1],
  ) {
    return Promise.reject(new Error('Activities repository is unavailable.'))
  }
  update(
    _userId: string,
    value: Parameters<IActivitiesRepository['update']>[1],
  ) {
    return Promise.resolve(value)
  }
  delete(_userId: string, _id: Parameters<IActivitiesRepository['delete']>[1]) {
    return Promise.resolve()
  }
}
