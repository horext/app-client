import type { Profile } from '#shared/domain'
import type { IBaseProfile, IProfile } from '#shared/domain/types/profile'

export interface IProfileRepository {
  get(userId: string): Promise<Profile<IProfile> | undefined>
  create(
    userId: string,
    profile: Profile<IBaseProfile>,
  ): Promise<Profile<IProfile>>
  update(userId: string, profile: Profile<IProfile>): Promise<Profile<IProfile>>
}
