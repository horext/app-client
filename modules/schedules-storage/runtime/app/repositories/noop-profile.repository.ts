import type { IProfileRepository } from './profile-repository.interface'

export class NoopProfileRepository implements IProfileRepository {
  get(_userId: string) {
    return Promise.resolve(undefined)
  }
  create(_userId: string, value: Parameters<IProfileRepository['create']>[1]) {
    return Promise.resolve(value)
  }
  update(_userId: string, value: Parameters<IProfileRepository['update']>[1]) {
    return Promise.resolve(value)
  }
}
