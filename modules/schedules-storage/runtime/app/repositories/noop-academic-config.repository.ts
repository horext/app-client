import type { IAcademicConfigRepository } from './academic-config.repository.interface'

export class NoopAcademicConfigRepository implements IAcademicConfigRepository {
  get(_userId: string) {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    _value: Parameters<IAcademicConfigRepository['create']>[1],
  ) {
    return Promise.reject(
      new Error('Academic config repository is unavailable.'),
    )
  }
  update(
    _userId: string,
    _value: Parameters<IAcademicConfigRepository['update']>[1],
  ) {
    return Promise.reject(
      new Error('Academic config repository is unavailable.'),
    )
  }
}
