import type { IUserProfile } from '../../shared/interfaces/profile'

export interface IProfileRepository {
  get(): Promise<IUserProfile | undefined>
  save(profile: IUserProfile): Promise<void>
}
