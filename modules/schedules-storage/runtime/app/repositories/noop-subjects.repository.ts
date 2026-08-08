import type { ISubjectsRepository } from './subjects-repository.interface'

export class NoopSubjectsRepository implements ISubjectsRepository {
  getAll() {
    return Promise.resolve([])
  }
  findById() {
    return Promise.resolve(undefined)
  }
  create(_userId: string, value: Parameters<ISubjectsRepository['create']>[1]) {
    return Promise.resolve(value)
  }
  update(_userId: string, value: Parameters<ISubjectsRepository['update']>[1]) {
    return Promise.resolve(value)
  }
  delete() {
    return Promise.resolve()
  }
}
