import type { Profile } from '../../shared/domain'

export interface IProfileRepository {
  get(userId: string): Promise<Profile | undefined>
  create(userId: string, profile: Profile): Promise<Profile>
  update(userId: string, profile: Profile): Promise<Profile>
}
