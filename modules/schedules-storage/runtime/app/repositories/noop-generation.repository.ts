import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'

export class NoopGenerationRepository implements IGenerationRepository {
  findAll(_userId: string) {
    return Promise.resolve([])
  }
  findById(
    _userId: string,
    _id: Parameters<IGenerationRepository['findById']>[1],
  ) {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    _value: Parameters<IGenerationRepository['create']>[1],
  ) {
    return Promise.reject(
      new Error('ScheduleGeneration repository is unavailable.'),
    )
  }
  update(
    _userId: string,
    _value: Parameters<IGenerationRepository['update']>[1],
  ) {
    return Promise.reject(
      new Error('ScheduleGeneration repository is unavailable.'),
    )
  }
  delete(_userId: string, _id: Parameters<IGenerationRepository['delete']>[1]) {
    return Promise.resolve()
  }
}
