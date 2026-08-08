import type { ISchedulesRepository } from './schedules-repository.interface'

export class NoopSchedulesRepository implements ISchedulesRepository {
  findAll(_userId: string) {
    return Promise.resolve([])
  }
  getEntries(
    _userId: string,
    _ids: Parameters<ISchedulesRepository['getEntries']>[1],
  ) {
    return Promise.resolve([])
  }
  getByKey(
    _userId: string,
    _scheduleSubjectKey: Parameters<ISchedulesRepository['getByKey']>[1],
  ) {
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
  deleteEntry(
    _userId: string,
    _id: Parameters<ISchedulesRepository['deleteEntry']>[1],
  ) {
    return Promise.resolve()
  }
  deleteEntries(
    _userId: string,
    _ids: Parameters<ISchedulesRepository['deleteEntries']>[1],
  ) {
    return Promise.resolve()
  }
}
