import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'

export class NoopGenerationRepository implements IGenerationRepository {
  getAll(_userId: string) {
    return Promise.resolve([])
  }
  get(_userId: string, _id: Parameters<IGenerationRepository['get']>[1]) {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    _value: Parameters<IGenerationRepository['create']>[1],
  ) {
    return Promise.reject(new Error('Generation repository is unavailable.'))
  }
  delete(_userId: string, _id: Parameters<IGenerationRepository['delete']>[1]) {
    return Promise.resolve()
  }
}
