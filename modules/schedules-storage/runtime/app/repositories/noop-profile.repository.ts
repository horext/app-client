import type { IProfileRepository } from './profile-repository.interface'

export class NoopProfileRepository implements IProfileRepository {
  get(_userId: string) {
    return Promise.resolve(undefined)
  }
  create(_userId: string, _value: Parameters<IProfileRepository['create']>[1]) {
    return Promise.reject(new Error('Profile repository is unavailable.'))
  }
  update(_userId: string, _value: Parameters<IProfileRepository['update']>[1]) {
    return Promise.reject(new Error('Profile repository is unavailable.'))
  }
}
