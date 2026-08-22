import type {
  IProfileCreate,
  IProfileUpdate,
} from '#shared/domain/types/profile'
import type { Profile } from '#shared/domain'

export interface IProfileService {
  get(userId: string): Promise<Profile | undefined>
  create(userId: string, initial: IProfileCreate): Promise<Profile>
  patch(userId: string, value: IProfileUpdate): Promise<Profile>
}
