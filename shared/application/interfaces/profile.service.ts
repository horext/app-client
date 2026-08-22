import type {
  IProfile,
  IProfileCreate,
  IProfileUpdate,
} from '#shared/domain/types/profile'
import type { Profile } from '#shared/domain'

export interface IProfileService {
  get(userId: string): Promise<Profile<IProfile> | undefined>
  create(userId: string, initial: IProfileCreate): Promise<Profile<IProfile>>
  patch(userId: string, value: IProfileUpdate): Promise<Profile<IProfile>>
}
