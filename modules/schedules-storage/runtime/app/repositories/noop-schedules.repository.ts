import type { ISchedulesRepository } from '#shared/application/repositories/schedules.repository'

export class NoopSchedulesRepository implements ISchedulesRepository {
  findAll(_userId: string) {
    return Promise.resolve([])
  }
  findBy(_userId: string, _id: Parameters<ISchedulesRepository['findBy']>[1]) {
    return Promise.resolve(undefined)
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
    _value: Parameters<ISchedulesRepository['create']>[1],
  ) {
    return Promise.reject(new Error('Schedules repository is unavailable.'))
  }
  createAll(
    _userId: string,
    _values: Parameters<ISchedulesRepository['createAll']>[1],
  ) {
    return Promise.reject(new Error('Schedules repository is unavailable.'))
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
