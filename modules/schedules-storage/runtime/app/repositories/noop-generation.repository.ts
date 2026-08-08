import type { IGenerationRepository } from './generation.repository.interface'

export class NoopGenerationRepository implements IGenerationRepository {
  getAll(_userId: string) {
    return Promise.resolve([])
  }
  get(_userId: string, _id: Parameters<IGenerationRepository['get']>[1]) {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    value: Parameters<IGenerationRepository['create']>[1],
  ) {
    return Promise.resolve(value)
  }
  delete(_userId: string, _id: Parameters<IGenerationRepository['delete']>[1]) {
    return Promise.resolve()
  }
}
