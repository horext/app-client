import type {
  IProfile,
  IProfileCreate,
  IProfileUpdate,
} from '#shared/domain/types/profile'

export interface IProfileService {
  get(userId: string): Promise<IProfile | undefined>
  create(userId: string, initial: IProfileCreate): Promise<IProfile>
  patch(userId: string, value: IProfileUpdate): Promise<IProfile>
}
