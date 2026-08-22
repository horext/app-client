import type { BaseProfile, Profile } from '#shared/domain'

export interface IProfileRepository {
  get(userId: string): Promise<Profile | undefined>
  create(userId: string, profile: BaseProfile): Promise<Profile>
  update(userId: string, profile: Profile): Promise<Profile>
}
