import type { IGenerationRepository } from './generation.repository.interface'

export class NoopGenerationRepository implements IGenerationRepository {
  getAll() {
    return Promise.resolve([])
  }
  get() {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    value: Parameters<IGenerationRepository['create']>[1],
  ) {
    return Promise.resolve(value)
  }
  delete() {
    return Promise.resolve()
  }
}
