import type { ISchedulesRepository } from './schedules-repository.interface'

export class NoopSchedulesRepository implements ISchedulesRepository {
  findAll() {
    return Promise.resolve([])
  }
  getEntries() {
    return Promise.resolve([])
  }
  getByKey() {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    value: Parameters<ISchedulesRepository['create']>[1],
  ) {
    return Promise.resolve(value)
  }
  createAll(
    _userId: string,
    values: Parameters<ISchedulesRepository['createAll']>[1],
  ) {
    return Promise.resolve(values)
  }
  update(
    _userId: string,
    value: Parameters<ISchedulesRepository['update']>[1],
  ) {
    return Promise.resolve(value)
  }
  deleteEntry() {
    return Promise.resolve()
  }
  deleteEntries() {
    return Promise.resolve()
  }
}
