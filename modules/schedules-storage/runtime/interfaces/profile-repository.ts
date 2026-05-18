import type { IUserProfile } from '~/interfaces/profile'

export interface IProfileRepository {
  get(): Promise<IUserProfile | undefined>
  save(profile: IUserProfile): Promise<void>
}
