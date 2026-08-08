import type { IAcademicConfigRepository } from './academic-config.repository.interface'

export class NoopAcademicConfigRepository implements IAcademicConfigRepository {
  get(_userId: string) {
    return Promise.resolve(undefined)
  }
  create(
    _userId: string,
    value: Parameters<IAcademicConfigRepository['create']>[1],
  ) {
    return Promise.resolve(value)
  }
  update(
    _userId: string,
    value: Parameters<IAcademicConfigRepository['update']>[1],
  ) {
    return Promise.resolve(value)
  }
}
