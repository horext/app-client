import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'

export class NoopActivitiesRepository implements IActivitiesRepository {
  findAll(_userId: string) {
    return Promise.resolve([])
  }
  findById(
    _userId: string,
    _id: Parameters<IActivitiesRepository['findById']>[1],
  ) {
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
