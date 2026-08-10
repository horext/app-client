import type { IBaseProfile, IProfile } from '#shared/domain/types/profile'

export interface IProfileService {
  getProfile(userId: string): Promise<IProfile | undefined>
  createProfile(userId: string, initial: IBaseProfile): Promise<IProfile>
  patch(
    userId: string,
    partial: Partial<IBaseProfile>,
  ): Promise<IProfile | undefined>
}
