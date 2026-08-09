import type { ISubjectsRepository } from './subjects-repository.interface'

export class NoopSubjectsRepository implements ISubjectsRepository {
  getAll(_userId: string) {
    return Promise.resolve([])
  }
  findById(
    _userId: string,
    _id: Parameters<ISubjectsRepository['findById']>[1],
  ) {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    _value: Parameters<ISubjectsRepository['create']>[1],
  ) {
    return Promise.reject(new Error('Subjects repository is unavailable.'))
  }
  update(_userId: string, value: Parameters<ISubjectsRepository['update']>[1]) {
    return Promise.resolve(value)
  }
  delete(_userId: string, _id: Parameters<ISubjectsRepository['delete']>[1]) {
    return Promise.resolve()
  }
}
