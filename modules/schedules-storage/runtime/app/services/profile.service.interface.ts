import type { IBaseProfile, IProfile } from '../../shared/interfaces/profile'

export interface IProfileService {
  getProfile(userId: string): Promise<IProfile | undefined>
  createProfile(userId: string, initial: IBaseProfile): Promise<IProfile>
  patch(userId: string, partial: Partial<IBaseProfile>): Promise<void>
}
